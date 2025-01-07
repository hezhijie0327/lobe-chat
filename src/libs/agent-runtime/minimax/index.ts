import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeMinimaxAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.minimax.chat/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      const { temperature, top_p, ...rest } = payload;

      return {
        ...rest,
        frequency_penalty: undefined,
        presence_penalty: undefined,
        stream: true,
        temperature: temperature === undefined || temperature <= 0 ? undefined : temperature / 2,
        top_p: top_p === 0 ? undefined : top_p,
      } as any;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_MINIMAX_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Minimax,
});
