import { ModelProviderCard } from '@/types/llm';

// ref https://platform.baichuan-ai.com/price
const Baichuan: ModelProviderCard = {
  chatModels: [
    {
      id: 'Baichuan4',
      tokens: 32_768,
    },
    {
      id: 'Baichuan3-Turbo',
      tokens: 32_768,
    },
    {
      id: 'Baichuan3-Turbo-128k',
      tokens: 128_000,
    },
    {
      id: 'Baichuan2-Turbo',
      tokens: 32_768,
    },
    {
      id: 'Baichuan2-Turbo-192k',
      tokens: 192_000,
    },
  ],
  checkModel: 'Baichuan4',
  id: 'baichuan',
  modelList: { showModelFetcher: true },
  name: 'baichuan',
};

export default Baichuan;
