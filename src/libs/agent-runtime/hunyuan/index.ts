import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeHunyuanAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://api.hunyuan.cloud.tencent.com/v1',
  debug: {
    chatCompletion: () => process.env.DEBUG_HUNYUAN_CHAT_COMPLETION === '1',
  },
  models: {
    transformModel: (m) => {
      const functionCallKeywords = [
        'hunyuan-turbo',
        'hunyuan-pro',
      ];

      const model = m as unknown as QwenModelCard;

      return {
        enabled: LOBE_DEFAULT_MODEL_LIST.find((m) => model.id.endsWith(m.id))?.enabled || false,
        functionCall: functionCallKeywords.some(keyword => model.id.toLowerCase().includes(keyword)) || model.modelCode.toLowerCase().includes('functioncall'),
        id: model.id,
        vision: model.modelCode.toLowerCase().includes('vision'),
      };
    },
  },
  provider: ModelProvider.Hunyuan,
});
