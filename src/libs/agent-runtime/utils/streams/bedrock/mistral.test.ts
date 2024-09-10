import { ReadableStream as NodeReadableStream } from 'stream/web';
import { AWSBedrockMistralStream, transformMistralStream } from './mistral';
import { StreamStack } from '../protocol';
import { InvokeModelWithResponseStreamResponse } from '@aws-sdk/client-bedrock-runtime';

describe('AWSBedrockMistralStream', () => {
  let mockReadableStream: NodeReadableStream;
  let mockController: ReadableStreamDefaultController;

  beforeEach(() => {
    mockReadableStream = new NodeReadableStream({
      start(controller) {
        mockController = controller;
      },
    });
  });

  test('handles basic text output', async () => {
    const stream = AWSBedrockMistralStream(mockReadableStream as unknown as ReadableStream);
    const reader = stream.getReader();

    mockController.enqueue(JSON.stringify({
      choices: [{
        message: { content: 'Hello, world!' },
      }],
    }));
    mockController.close();

    const { value } = await reader.read();
    expect(value).toBe('data: {"data":"Hello, world!","id":"chat_mock-id","type":"text"}\n\n');
  });

  test('handles tool calls', async () => {
    const stream = AWSBedrockMistralStream(mockReadableStream as unknown as ReadableStream);
    const reader = stream.getReader();

    mockController.enqueue(JSON.stringify({
      choices: [{
        message: {
          content: '',
          tool_calls: [{
            id: 'tool1',
            function: {
              name: 'testFunction',
              arguments: '{"arg": "value"}',
            },
          }],
        },
        stop_reason: 'tool_calls',
      }],
    }));
    mockController.close();

    const { value } = await reader.read();
    if (value) {
      expect(JSON.parse(value.split('data: ')[1])).toEqual({
        data: [{
          function: {
            name: 'testFunction',
            arguments: '{"arg": "value"}',
          },
          id: 'tool1',
          index: 0,
          type: 'function',
        }],
        id: 'chat_mock-id',
        type: 'tool_calls',
      });
    } else {
      fail('Expected a value but received undefined');
    }
  });

  test('handles stop chunk with metrics', async () => {
    const stream = AWSBedrockMistralStream(mockReadableStream as unknown as ReadableStream);
    const reader = stream.getReader();

    mockController.enqueue(JSON.stringify({
      "choices":[{"index":0,"message":{"role":"assistant","content":""},"stop_reason":"stop"}],
      "amazon-bedrock-invocationMetrics":{"inputTokenCount":63,"outputTokenCount":263,"invocationLatency":5330,"firstByteLatency":122}
    }));
    mockController.close();

    const { value } = await reader.read();
    if (value) {
      expect(JSON.parse(value.split('data: ')[1])).toEqual({
        data: 'stop',
        id: 'chat_mock-id',
        type: 'stop'
      });
    } else {
      fail('Expected a value but received undefined');
    }
  });

  test('handles tool calls chunk with specific format', async () => {
    const stream = AWSBedrockMistralStream(mockReadableStream as unknown as ReadableStream);
    const reader = stream.getReader();

    mockController.enqueue(JSON.stringify({
      "choices":[{"index":0,"message":{"role":"assistant","content":"","tool_calls":[{"id":"3NcHNntdRyaHu8zisKJAhQ","function":{"name":"realtime-weather____fetchCurrentWeather","arguments":"{\"city\": \"Singapore\"}"}}]},"stop_reason":"tool_calls"}]
    }));
    mockController.close();

    const { value } = await reader.read();
    if (value) {
      expect(JSON.parse(value.split('data: ')[1])).toEqual({
        data: [{
          function: {
            name: "realtime-weather____fetchCurrentWeather",
            arguments: "{\"city\": \"Singapore\"}"
          },
          id: "3NcHNntdRyaHu8zisKJAhQ",
          index: 0,
          type: 'function'
        }],
        id: 'chat_mock-id',
        type: 'tool_calls'
      });
    } else {
      fail('Expected a value but received undefined');
    }
  });
});

describe('transformMistralStream', () => {
  const mockStack: StreamStack = { id: 'chat_mock-id' };

  test('transforms text content', () => {
    const chunk = {
      choices: [{
        message: { content: 'Test content' },
      }],
    };
    const result = transformMistralStream(chunk, mockStack);
    expect(result).toEqual({
      data: 'Test content',
      id: 'chat_mock-id',
      type: 'text',
    });
  });

  test('transforms tool calls', () => {
    const chunk = {
      choices: [{
        message: {
          content: '',
          tool_calls: [{
            id: 'tool1',
            function: {
              name: 'testFunction',
              arguments: '{"arg": "value"}',
            },
          }],
        },
      }],
    };
    const result = transformMistralStream(chunk, mockStack);
    expect(result).toEqual({
      data: [{
        function: {
          name: 'testFunction',
          arguments: '{"arg": "value"}',
        },
        id: 'tool1',
        index: 0,
        type: 'function',
      }],
      id: 'chat_mock-id',
      type: 'tool_calls',
    });
  });

  test('transforms stop chunk with metrics', () => {
    const chunk = {
      "choices":[{"index":0,"message":{"role":"assistant","content":""},"stop_reason":"stop"}],
      "amazon-bedrock-invocationMetrics":{"inputTokenCount":63,"outputTokenCount":263,"invocationLatency":5330,"firstByteLatency":122}
    };
    const result = transformMistralStream(chunk, mockStack);
    expect(result).toEqual({
      data: 'stop',
      id: 'chat_mock-id',
      type: 'stop'
    });
  });

  test('transforms tool calls chunk with specific format', () => {
    const chunk = {
      "choices":[{"index":0,"message":{"role":"assistant","content":"","tool_calls":[{"id":"3NcHNntdRyaHu8zisKJAhQ","function":{"name":"realtime-weather____fetchCurrentWeather","arguments":"{\"city\": \"Singapore\"}"}}]},"stop_reason":"tool_calls"}]
    };
    const result = transformMistralStream(chunk, mockStack);
    expect(result).toEqual({
      data: [{
        function: {
          name: "realtime-weather____fetchCurrentWeather",
          arguments: "{\"city\": \"Singapore\"}"
        },
        id: "3NcHNntdRyaHu8zisKJAhQ",
        index: 0,
        type: 'function'
      }],
      id: 'chat_mock-id',
      type: 'tool_calls'
    });
  });
});
