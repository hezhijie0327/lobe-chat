import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { QwenAIStream } from '../utils/streams';

export const QwenOpenSourceModels = [
  'qwen-72b-chat',
  'qwen-14b-chat',
  'qwen-7b-chat',
  'qwen-1.8b-chat',
  'qwen-1.8b-longcontext-chat',
];

export const LobeQwenAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      const { model, presence_penalty, temperature, top_p, ...rest } = payload;

      return {
        ...rest,
        frequency_penalty: undefined,
        model,
        presence_penalty: 
          QwenOpenSourceModels.includes(model) 
            ? undefined 
            : (presence_penalty !== undefined && presence_penalty >= -2 && presence_penalty <= 2) 
              ? presence_penalty 
              : undefined,
        stream: !payload.tools,
        temperature: (temperature !== undefined && temperature >= 0 && temperature < 2) ? temperature : undefined,
        ...(model.startsWith('qwen-vl') ? {
          top_p: (top_p !== undefined && top_p > 0 && top_p <= 1) ? top_p : undefined,
        } : {
          enable_search: true,
          top_p: (top_p !== undefined && top_p > 0 && top_p < 1) ? top_p : undefined,
        }),
      } as any;
    },
    handleStream: QwenAIStream,
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_QWEN_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Qwen,
});
