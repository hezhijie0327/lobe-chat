import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeNvidiaAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_NVIDIA_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.Nvidia,
});
