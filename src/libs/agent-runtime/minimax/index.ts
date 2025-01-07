import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const getMaxTokens = (model: string): number | undefined => {
  switch (model) {
    case 'abab6.5t-chat':
    case 'abab6.5g-chat':
    case 'abab5.5s-chat':
    case 'abab5.5-chat':
      return 4096;
    case 'abab7-chat-preview':
    case 'abab6.5s-chat':
      return 8192;
    default:
      return undefined;
  }
};

export const LobeMinimaxAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.minimax.chat/v1',
  chatCompletion: {
    handlePayload: (payload) => {
      const { temperature, top_p, ...params } = payload;

      return {
        ...params,
        frequency_penalty: undefined,
        max_tokens: payload.max_tokens !== undefined ? payload.max_tokens : getMaxTokens(payload.model),
        presence_penalty: undefined,
        stream: true,
        temperature: temperature === undefined || temperature <= 0 ? undefined : temperature / 2,
        tools: params.tools?.map((tool) => ({
          function: {
            description: tool.function.description,
            name: tool.function.name,
            parameters: JSON.stringify(tool.function.parameters),
          },
          type: 'function',
        })),
        top_p: top_p !== undefined && top_p > 0 && top_p <= 1 ? top_p : undefined,
      } as any;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_MINIMAX_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Minimax,
});
