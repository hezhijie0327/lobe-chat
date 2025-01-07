import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/modelProviders';

export interface FireworksAIModelCard {
  context_length: number;
  id: string;
  supports_image_input: boolean;
  supports_tools: boolean;
}

export const LobeFireworksAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.fireworks.ai/inference/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_FIREWORKSAI_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const model = m as unknown as FireworksAIModelCard;

      return {
        abilities: {
          functionCall: model.supports_tools,
          vision: model.supports_image_input,
        },
        contextWindowTokens: model.context_length,
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id.endsWith(m.id))?.enabled || false,
        id: model.id,
      };
    },
  },
  provider: ModelProvider.FireworksAI,
});
