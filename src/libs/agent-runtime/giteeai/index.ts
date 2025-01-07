import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/modelProviders';

export interface GiteeAIModelCard {
  id: string;
}

export const LobeGiteeAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://ai.gitee.com/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_GITEE_AI_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const functionCallKeywords = [
        'qwen2.5',
        'glm-4',
      ];

      const visionKeywords = [
        'internvl',
        'qwen2-vl',
      ];

      const model = m as unknown as GiteeAIModelCard;

      return {
        abilities: {
          functionCall: functionCallKeywords.some(keyword => model.id.toLowerCase().includes(keyword)) && !model.id.toLowerCase().includes('qwen2.5-coder'),
          vision: visionKeywords.some(keyword => model.id.toLowerCase().includes(keyword)),
        },
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id.endsWith(m.id))?.enabled || false,
        id: model.id,
      };
    },
  },
  provider: ModelProvider.GiteeAI,
});
