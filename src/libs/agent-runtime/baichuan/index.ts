import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeBaichuanAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.baichuan-ai.com/v1',
  chatCompletion: {
    handlePayload: (payload: ChatStreamPayload) => {
      // frequency_penalty must greater then 1, less then 2
      const { frequency_penalty, ...res } = payload;

      let param = {
        frequency_penalty: frequency_penalty !== undefined ? 
          Math.min(Math.max(frequency_penalty, 1), 2) : 1
      };

      return { ...res, ...param } as OpenAI.ChatCompletionCreateParamsStreaming;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_BAICHUAN_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Baichuan,
});
