import { ModelProviderCard } from '@/types/llm';

// ref https://platform.baichuan-ai.com/price
const Baichuan: ModelProviderCard = {
  chatModels: [
    {
      displayName: 'Baichuan 4',
      functionCall: true,
      id: 'Baichuan4',
      tokens: 32_768,
    },
    {
      displayName: 'Baichuan 3 Turbo',
      functionCall: true,
      id: 'Baichuan3-Turbo',
      tokens: 32_768,
    },
    {
      displayName: 'Baichuan 3 Turbo 128k',
      id: 'Baichuan3-Turbo-128k',
      tokens: 128_000,
    },
    {
      displayName: 'Baichuan 2 Turbo',
      id: 'Baichuan2-Turbo',
      tokens: 32_768,
    },
    {
      displayName: 'Baichuan 2 Turbo 192k',
      id: 'Baichuan2-Turbo-192k',
      tokens: 192_000,
    },
  ],
  checkModel: 'Baichuan4',
  id: 'baichuan',
  modelList: { showModelFetcher: true },
  name: 'Baichuan',
};

export default Baichuan;
