import OpenAI from 'openai';

import { ChatStreamPayload, ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import type { ChatModelCard } from '@/types/llm';
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
  models: async ({ client }) => {
    const models = await client.models.list();

    return models.data
      .map((model) => {
        const baichuanModel = { ...model } as BaichuanModelCard;

        return {
          contextWindowTokens: baichuanModel.max_input_length,
          displayName: baichuanModel.model_show_name,
          enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => baichuanModel.model.endsWith(m.id))?.enabled || false,
          functionCall: baichuanModel.function_call,
          id: baichuanModel.model,
          maxTokens:
            typeof model.max_tokens === 'number'
              ? model.max_tokens
              : undefined,
        };
      });
  },
  provider: ModelProvider.Baichuan,
});
