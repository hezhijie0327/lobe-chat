import OpenAI from 'openai';

import { ChatStreamPayload, ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeBaichuanAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.baichuan-ai.com/v1',
  chatCompletion: {
    handlePayload: (payload: ChatStreamPayload) => {
      // frequency_penalty must be greater than or equal to 1 and less than or equal to 2
      const { frequency_penalty, ...rest } = payload;
      const adjustedFrequencyPenalty = frequency_penalty !== undefined
        ? Math.min(Math.max(frequency_penalty, 1), 2)
        : 1.5;  // Default value set to 1.5 (middle of the allowed range)

      return {
        ...rest,
        frequency_penalty: adjustedFrequencyPenalty,
      } as OpenAI.ChatCompletionCreateParamsStreaming;
    },
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_BAICHUAN_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Baichuan,
});
