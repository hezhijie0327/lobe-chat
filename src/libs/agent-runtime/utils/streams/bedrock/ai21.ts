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
    'stop_reason'?: null | string;
    'index'?: number;
  }[];
  'id'?: string;
  'usage'?: {
    'completion_tokens': number;
    'prompt_tokens': number;
    'total_tokens': number;
  };
}

export const transformOpenAICompatibleStream = (
  chunk: BedrockOpenAICompatibleStreamChunk,
  stack: StreamStack,
): StreamProtocolChunk => {
  const choice = chunk.choices[0];
  const content = choice.delta.content || '';

  if (choice.finish_reason === 'stop') {
    return { data: 'finished', id: stack.id, type: 'stop' };
  }

  if (!content) {
    // Return a chunk indicating this is a no-op, or use a type that represents an empty chunk
    return { data: '', id: stack.id, type: 'noop' as 'text' };
  }

  return { data: content, id: stack.id, type: 'text' };
};

export const AWSBedrockAi21Stream = (
  res: InvokeModelWithResponseStreamResponse | ReadableStream,
  cb?: ChatStreamCallbacks,
): ReadableStream<string> => {
  const streamStack: StreamStack = { id: 'chat_' + nanoid() };

  const stream = res instanceof ReadableStream ? res : createBedrockStream(res);

  return stream
    .pipeThrough(createSSEProtocolTransformer(transformOpenAICompatibleStream, streamStack))
    .pipeThrough(createCallbacksTransformer(cb));
};
