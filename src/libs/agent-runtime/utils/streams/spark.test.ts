import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SparkAIStream, transformSparkResponseToStream } from './spark';

describe('SparkAIStream', () => {
  beforeAll(() => {});

  it('should transform non-streaming response to stream', async () => {
    const mockResponse = {
      code: 0,
      message: "Success",
      sid: "cha000ceba6@dx193d200b580b8f3532",
      choices: [
        {
          message: {
            role: "assistant",
            content: "",
            tool_calls: {
              type: "function",
              function: {
                arguments: '{"city":"Shanghai"}',
                name: "realtime-weather____fetchCurrentWeather"
              }
            }
          },
          index: 0
        }
      ],
      usage: {
        prompt_tokens: 8,
        completion_tokens: 0,
        total_tokens: 8
      }
    };

    const stream = transformSparkResponseToStream(mockResponse);
    const decoder = new TextDecoder();
    const chunks = [];

    // @ts-ignore
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0].choices[0].delta.tool_calls).toEqual([{
      function: {
        arguments: '{"city":"Shanghai"}',
        name: "realtime-weather____fetchCurrentWeather"
      },
      id: undefined,
      index: 0,
      type: "function"
    }]);
    expect(chunks[1].choices[0].finish_reason).toBeDefined();
  });

  it('should transform streaming response with tool calls', async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue({
          code: 0,
          message: "Success",
          sid: "cha000b0bf9@dx193d1ffa61cb894532",
          id: "cha000b0bf9@dx193d1ffa61cb894532",
          created: 1734395014,
          choices: [
            {
              delta: {
                role: "assistant",
                content: "",
                tool_calls: {
                  type: "function",
                  function: {
                    arguments: '{"city":"Shanghai"}',
                    name: "realtime-weather____fetchCurrentWeather"
                  }
                }
              },
              index: 0
            }
          ]
        });
        controller.close();
      }
    });

    const onToolCallMock = vi.fn();

    const protocolStream = SparkAIStream(mockStream, {
      onToolCall: onToolCallMock
    });

    const decoder = new TextDecoder();
    const chunks = [];

    // @ts-ignore
    for await (const chunk of protocolStream) {
      chunks.push(decoder.decode(chunk, { stream: true }));
    }

    expect(chunks).toEqual([
      'id: cha000b0bf9@dx193d1ffa61cb894532\n',
      'event: tool_calls\n',
      `data: [{"function":{"name":"realtime-weather____fetchCurrentWeather","arguments":"{\\"city\\":\\"Shanghai\\"}"},"type":"function","index":0}]\n\n`
    ]);

    expect(onToolCallMock).toHaveBeenCalledTimes(1);
  });

  it('should handle text content in stream', async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue({
          id: "test-id",
          choices: [
            {
              delta: {
                content: "Hello",
                role: "assistant"
              },
              index: 0
            }
          ]
        });
        controller.enqueue({
          id: "test-id",
          choices: [
            {
              delta: {
                content: " World",
                role: "assistant"
              },
              index: 0
            }
          ]
        });
        controller.close();
      }
    });

    const onTextMock = vi.fn();
    
    const protocolStream = SparkAIStream(mockStream, {
      onText: onTextMock
    });

    const decoder = new TextDecoder();
    const chunks = [];

    // @ts-ignore
    for await (const chunk of protocolStream) {
      chunks.push(decoder.decode(chunk, { stream: true }));
    }

    expect(chunks).toEqual([
      'id: test-id\n',
      'event: text\n',
      'data: "Hello"\n\n',
      'id: test-id\n',
      'event: text\n',
      'data: " World"\n\n'
    ]);

    expect(onTextMock).toHaveBeenNthCalledWith(1, '"Hello"');
    expect(onTextMock).toHaveBeenNthCalledWith(2, '" World"');
  });

  it('should handle empty stream', async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.close();
      }
    });

    const protocolStream = SparkAIStream(mockStream);

    const decoder = new TextDecoder();
    const chunks = [];

    // @ts-ignore
    for await (const chunk of protocolStream) {
      chunks.push(decoder.decode(chunk, { stream: true }));
    }

    expect(chunks).toEqual([]);
  });
});
