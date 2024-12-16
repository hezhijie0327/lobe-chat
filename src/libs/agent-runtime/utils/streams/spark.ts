import { ChatCompletionContentPartText } from 'ai/prompts';
import OpenAI from 'openai';
import { ChatCompletionContentPart } from 'openai/resources/index.mjs';
import type { Stream } from 'openai/streaming';

import { ChatStreamCallbacks } from '../../types';
import {
  StreamProtocolChunk,
  StreamProtocolToolCallChunk,
  StreamToolCallChunkData,
  convertIterableToStream,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
  generateToolCallId,
} from './protocol';

export const transformSparkStream = (chunk: OpenAI.ChatCompletionChunk): StreamProtocolChunk => {
  const item = chunk.choices[0];

  if (!item) {
    return { data: chunk, id: chunk.id, type: 'data' };
  }

  if (item.delta?.tool_calls) {
    const toolCallsArray = Array.isArray(item.delta.tool_calls)
      ? item.delta.tool_calls
      : [item.delta.tool_calls]; // 如果不是数组，包装成数组

    return {
      data: toolCallsArray.map((toolCall, index) => ({
        function: toolCall.function,
        id: toolCall.id || generateToolCallId(index, toolCall.function?.name),
        index: typeof toolCall.index !== 'undefined' ? toolCall.index : index,
        type: toolCall.type || 'function',
      })),
      id: chunk.id,
      type: 'tool_calls',
    } as StreamProtocolToolCallChunk;
  }

  if (typeof item.delta?.content === 'string') {
    return { data: item.delta.content, id: chunk.id, type: 'text' };
  }

  if (item.finish_reason) {
    return { data: item.finish_reason, id: chunk.id, type: 'stop' };
  }

  if (item.delta?.content === null) {
    return { data: item.delta, id: chunk.id, type: 'data' };
  }

  return {
    data: { delta: item.delta, id: chunk.id, index: item.index },
    id: chunk.id,
    type: 'data',
  };
};

export const SparkAIStream = (
  stream: Stream<OpenAI.ChatCompletionChunk> | ReadableStream,
  callbacks?: ChatStreamCallbacks,
) => {
  const readableStream =
    stream instanceof ReadableStream ? stream : convertIterableToStream(stream);

  return readableStream
    .pipeThrough(createSSEProtocolTransformer(transformSparkStream))
    .pipeThrough(createCallbacksTransformer(callbacks));
};
