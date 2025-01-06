import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/modelProviders';
import { Ai360ModelCard } from './type';

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
      const model = m as unknown as Ai360ModelCard;

      return {
        contextWindowTokens: model.total_tokens,
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id.endsWith(m.id))?.enabled || false,
        id: model.id,
        maxTokens:
          typeof model.max_tokens === 'number'
            ? model.max_tokens
            : undefined,
      };
    },
  provider: ModelProvider.Ai360,
});
