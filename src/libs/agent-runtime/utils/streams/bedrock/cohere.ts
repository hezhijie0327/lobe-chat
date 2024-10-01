import { InvokeModelWithResponseStreamResponse } from '@aws-sdk/client-bedrock-runtime';

import { nanoid } from '@/utils/uuid';

import { ChatStreamCallbacks } from '../../../types';
import {
  StreamProtocolChunk,
  StreamProtocolToolCallChunk,
  StreamStack,
  StreamToolCallChunkData,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
  generateToolCallId,
} from '../protocol';
import { createBedrockStream } from './common';

interface AmazonBedrockInvocationMetrics {
  firstByteLatency: number;
  inputTokenCount: number;
  invocationLatency: number;
  outputTokenCount: number;
}

// https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-cohere-command-r-plus.html
interface BedrockCohereStreamChunk {
  'amazon-bedrock-invocationMetrics'?: AmazonBedrockInvocationMetrics;
  'event_type': string;
  'finish_reason'?: string;
  'is_finished': boolean;
  'response'?: {
    'chat_history': {
      'message': string;
      'role': string;
    }[];
    'finish_reason': string;
    'generation_id': string;
    'meta'?: {
      'api_version': {
        'version': string;
      };
      'billed_units': {
        'input_tokens': number;
        'output_tokens': number;
      };
      'tokens': {
        'input_tokens': number;
        'output_tokens': number;
      };
    };
    'response_id': string;
    'text': string;
    'tool_calls'?: {
      'name': string;
      'parameters': { [key: string]: string };
    }[];
  };
  'text'?: string;
  'tool_call_delta'?: {
    'index'?: number;
    'map'?: any;
    'name'?: string;
    'parameters'?: string;
  };
}

export const transformCohereStream = (
  chunk: BedrockCohereStreamChunk,
  stack: StreamStack,
): StreamProtocolChunk => {
  // remove 'amazon-bedrock-invocationMetrics' from chunk
  delete chunk['amazon-bedrock-invocationMetrics'];

  // {"is_finished":false,"event_type":"tool-calls-generation","text":"I will use the 'Realtime Weather' tool to search for the current weather in Shanghai and relay this information to the user.","tool_calls":[{"name":"realtime_weather____fetchCurrentWeather","parameters":{"city":"Shanghai"}}]}
  if (chunk?.tool_call_delta) {
    return {
      data: chunk.tool_call_delta?.map(
        (value: any, index: any): StreamToolCallChunkData => ({
          function: {
            arguments: JSON.stringify(value.parameters) || '{}', // Ensure it's a string
            name: value.name || null,
          },
          id: generateToolCallId(index, value.name), // Generate ID
          index: typeof value.index !== 'undefined' ? value.index : index,
          type: value.type || 'function', // Default to 'function'
        }),
      ),
      id: stack.id,
      type: 'tool_calls',
    } as StreamProtocolToolCallChunk;
  }
  
  if (chunk.finish_reason) {
    return { data: chunk.finish_reason, id: stack.id, type: 'stop' };
  }

  return { data: chunk.text, id: stack.id, type: 'text' };
};

export const AWSBedrockCohereStream = (
  res: InvokeModelWithResponseStreamResponse | ReadableStream,
  cb?: ChatStreamCallbacks,
): ReadableStream<string> => {
  const streamStack: StreamStack = { id: 'chat_' + nanoid() };

  const stream = res instanceof ReadableStream ? res : createBedrockStream(res);

  return stream
    .pipeThrough(createSSEProtocolTransformer(transformCohereStream, streamStack))
    .pipeThrough(createCallbacksTransformer(cb));
};
