import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeCohereAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.cohere.com/v2/chat',
  debug: {
    chatCompletion: () => process.env.DEBUG_COHERE_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Cohere,
});
