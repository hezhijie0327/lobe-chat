import { InvokeModelWithResponseStreamResponse } from '@aws-sdk/client-bedrock-runtime';

import { nanoid } from '@/utils/uuid';

import { ChatStreamCallbacks } from '../../../types';
import {
  StreamProtocolChunk,
  StreamStack,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
} from '../protocol';
import { createBedrockStream } from './common';

interface AmazonBedrockInvocationMetrics {
  firstByteLatency: number;
  inputTokenCount: number;
  invocationLatency: number;
  outputTokenCount: number;
}

interface BedrockOpenAICompatibleStreamChunk {
  'amazon-bedrock-invocationMetrics'?: AmazonBedrockInvocationMetrics;
  'choices': {
    'delta': {
      'content': string;
    };
    'finish_reason'?: null | 'stop' | string;
    'index'?: number;
    'stop_reason'?: null | string;
  }[];
  'id'?: string;
  'meta'?: {
    'requestDurationMillis': number;
  };
  'usage'?: {
    'completion_tokens': number;
    'prompt_tokens': number;
    'total_tokens': number;
  };
}

export const transformAi21Stream = (
  chunk: BedrockOpenAICompatibleStreamChunk,
  stack: StreamStack,
): StreamProtocolChunk => {
  // remove 'amazon-bedrock-invocationMetrics' from chunk
  // eg: "amazon-bedrock-invocationMetrics":{"inputTokenCount":63,"outputTokenCount":263,"invocationLatency":5330,"firstByteLatency":122}}
  delete chunk['amazon-bedrock-invocationMetrics'];

  // {"id":"chat-ae86a1e555f04e5cbddb86cc6a98ce5e","choices":[{"index":0,"delta":{"content":"?"},"finish_reason":"stop","stop_reason":"<|eom|>"}],"usage":{"prompt_tokens":144,"total_tokens":158,"completion_tokens":14},"meta":{"requestDurationMillis":146}}
  const item = chunk.choices[0];
  if (!item) {
    return { data: chunk, id: stack.id, type: 'data' };
  }

  if (item.finish_reason) {
    return { data: item.finish_reason, id: stack.id, type: 'stop' };
  }

  return { data: item.delta?.content, id: stack.id, type: 'text' };
};

export const AWSBedrockAi21Stream = (
  res: InvokeModelWithResponseStreamResponse | ReadableStream,
  cb?: ChatStreamCallbacks,
): ReadableStream<string> => {
  const streamStack: StreamStack = { id: 'chat_' + nanoid() };

  const stream = res instanceof ReadableStream ? res : createBedrockStream(res);

  return stream
    .pipeThrough(createSSEProtocolTransformer(transformAi21Stream, streamStack))
    .pipeThrough(createCallbacksTransformer(cb));
};
