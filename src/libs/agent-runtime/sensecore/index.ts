import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeSenseCoreAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.sensenova.cn/compatible-mode/v1',
  chatCompletion: {
    handlePayload: (payload: ChatStreamPayload) => {
      const { frequency_penalty, top_p, ...rest } = payload;
    
      return {
        ...rest,
        frequency_penalty: frequency_penalty !== undefined
          ? Math.max( 0.0001, Math.min( 2, frequency_penalty ) )
          : undefined,
        top_p: top_p !== undefined
          ? Math.max( 0.0001, Math.min( 0.9999, top_p ) )
          : undefined,
      } as OpenAI.ChatCompletionCreateParamsStreaming;
    }
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_SENSECORE_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.SenseCore,
});
