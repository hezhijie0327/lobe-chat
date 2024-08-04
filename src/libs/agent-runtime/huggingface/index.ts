import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeHuggingFaceAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_HUGGINGFACE_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.HuggingFace,
});
