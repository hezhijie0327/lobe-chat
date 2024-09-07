
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

// https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral-chat-completion.html
// mistral_chunk: {"id":"chat-ae86a1e555f04e5cbddb86cc6a98ce5e","choices":[{"index":0,"delta":{"content":"?"},"finish_reason":"stop","stop_reason":"<|eom|>"}],"usage":{"prompt_tokens":144,"total_tokens":158,"completion_tokens":14},"meta":{"requestDurationMillis":146}},"amazon-bedrock-invocationMetrics":{"inputTokenCount":63,"outputTokenCount":263,"invocationLatency":5330,"firstByteLatency":122}}
interface BedrockMistralStreamChunk {
  'amazon-bedrock-invocationMetrics'?: AmazonBedrockInvocationMetrics;
  'choices': {
    'message': {
      'content': string;
      'role'?: string;
    };
    'index'?: number;
    'stop_reason'?: null | string;
  }[];
}

export const transformMistralStream = (
  chunk: BedrockMistralStreamChunk,
  stack: StreamStack,
): StreamProtocolChunk => {
  // remove 'amazon-bedrock-invocationMetrics' from chunk
  delete chunk['amazon-bedrock-invocationMetrics'];

  if (!chunk.choices || chunk.choices.length === 0) {
    return { data: chunk, id: stack.id, type: 'data' };
  }

  const item = chunk.choices[0];

  if (typeof item.delta?.content === 'string') {
    return { data: item.delta.content, id: stack.id, type: 'text' };
  }

  if (item.finish_reason) {
    return { data: item.finish_reason, id: stack.id, type: 'stop' };
  }

  return {
    data: { delta: item.delta, id: stack.id, index: item.index },
    id: stack.id,
    type: 'data',
  };
};

export const AWSBedrockMistralStream = (
  res: InvokeModelWithResponseStreamResponse | ReadableStream,
  cb?: ChatStreamCallbacks,
): ReadableStream<string> => {
  const streamStack: StreamStack = { id: 'chat_' + nanoid() };

  const stream = res instanceof ReadableStream ? res : createBedrockStream(res);

  return stream
    .pipeThrough(createSSEProtocolTransformer(transformMistralStream, streamStack))
    .pipeThrough(createCallbacksTransformer(cb));
};
