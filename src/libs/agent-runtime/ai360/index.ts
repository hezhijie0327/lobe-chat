import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/aiModels';

export interface Ai360ModelCard {
  id: string;
  max_tokens: number;
  total_tokens: number;
}

export const LobeAi360AI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.360.cn/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      return {
        ...payload,
        stream: !payload.tools,
      } as any;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_AI360_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const reasoningKeywords = [
        '360gpt2-o1',
        '360zhinao2-o1',
      ];

      const model = m as unknown as Ai360ModelCard;

      const knownModel = LOBE_DEFAULT_MODEL_LIST.find((m) => model.id === m.id) as unknown as any;

      return {
        contextWindowTokens: model.total_tokens,
        displayName: knownModels?.displayName ?? undefined,
        enabled: knownModels?.enabled || false,
        functionCall: model.id === '360gpt-pro' || knownModels?.abilities?.functionCall || false,
        id: model.id,
        maxTokens:
          typeof model.max_tokens === 'number'
            ? model.max_tokens
            : undefined,
        reasoning: reasoningKeywords.some(keyword => model.id.toLowerCase().includes(keyword)) || knownModels?.abilities?.reasoning || false,
      };
    },
  },
  provider: ModelProvider.Ai360,
});
