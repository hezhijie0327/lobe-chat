import { AgentRuntimeErrorType } from '../error';
import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { LOBE_DEFAULT_MODEL_LIST } from '@/config/modelProviders';

export interface GroqModelCard {
  context_window: number;
  id: string;
}

export const LobeGroq = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.groq.com/openai/v1',
  chatCompletion: {
    handleError: (error) => {
      // 403 means the location is not supported
      if (error.status === 403)
        return { error, errorType: AgentRuntimeErrorType.LocationNotSupportError };
    },
    handlePayload: (payload) => {
      const { temperature, ...restPayload } = payload;
      return {
        ...restPayload,
        // disable stream for tools due to groq dont support
        stream: !payload.tools,

        temperature: temperature <= 0 ? undefined : temperature,
      } as any;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_GROQ_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const model = m as unknown as GroqModelCard;

      return {
        contextWindowTokens: model.context_window,
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id.endsWith(m.id))?.enabled || false,
        functionCall: model.id.includes('tool'),
        id: model.id,
        vision: model.id.includes('vision'),
      };
    },
  },
  provider: ModelProvider.Groq,
});
