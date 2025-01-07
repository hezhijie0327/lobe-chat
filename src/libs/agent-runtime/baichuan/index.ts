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
    // 获取 Baichuan 模型列表
    const modelsPage = await client.models.list() as any;
    const modelList: BaichuanModelCard[] = modelsPage.data; // 假设模型数据在 'data' 字段中
  
    return modelList
      .map((model) => {
        const knownModel = LOBE_DEFAULT_MODEL_LIST.find((m) => m.id === model.model);
  
        if (knownModel) {
          return knownModel;
        }
  
        // 如果在默认模型列表中没有找到，则返回新的模型结构
        return {
          contextWindowTokens: model.max_input_length,
          displayName: model.model_show_name,
          enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.model.endsWith(m.id))?.enabled || false,
          functionCall: model.function_call,
          id: model.model,  // 假设 Baichuan 的模型 id 是 'model'
          maxTokens: model.max_tokens,
        };
      })
      .filter(Boolean) as ChatModelCard[];  // 过滤掉空值
  },
  provider: ModelProvider.Baichuan,
});
