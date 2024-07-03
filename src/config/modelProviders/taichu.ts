import { ModelProviderCard } from '@/types/llm';

// ref https://ai-maas.wair.ac.cn/#/doc
const Taichu: ModelProviderCard = {
  chatModels: [
    {
      description: '语言大模型',
      displayName: 'Taichu-2.0',
      enabled: true,
      functionCall: false,
      id: 'taichu_llm',
      tokens: 32_768,
    },
    {
      description: '多模态大模型',
      displayName: 'Taichu-2.0V',
      enabled: false,
      functionCall: false,
      id: 'taichu_vqa',
      tokens: 4096,
      vision: true,
    },
  ],
  checkModel: 'taichu_llm',
  id: 'taichu',
  modelList: { showModelFetcher: true },
  name: 'Taichu',
};

export default Taichu;
