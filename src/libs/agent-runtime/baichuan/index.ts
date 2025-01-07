import OpenAI from 'openai';

import { ChatStreamPayload, ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/modelProviders';

export interface BaichuanModelCard {
  function_call: boolean;
  max_input_length: number;
  max_tokens: number;
  model: string;
  model_show_name: string;
}

export const LobeBaichuanAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.baichuan-ai.com/v1',
  chatCompletion: {
    handlePayload: (payload: ChatStreamPayload) => {
      const { temperature, ...rest } = payload;

      return {
        ...rest,
        // [baichuan] frequency_penalty must be between 1 and 2.
        frequency_penalty: undefined,
        temperature: temperature !== undefined ? temperature / 2 : undefined,
      } as OpenAI.ChatCompletionCreateParamsStreaming;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_BAICHUAN_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const model = m as unknown as BaichuanModelCard;

      return {
        contextWindowTokens: model.max_input_length,
        displayName: model.model_show_name,
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.model.endsWith(m.model))?.enabled || false,
        functionCall: model.function_call,
        id: model.model,
        maxTokens:
          typeof model.max_tokens === 'number'
            ? model.max_tokens
            : undefined,
      };
    },
  },
  provider: ModelProvider.Baichuan,
});
