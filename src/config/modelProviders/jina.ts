import { ModelProviderCard } from '@/types/llm';

const Jina: ModelProviderCard = {
  chatModels: [],
  id: 'jina',
  modelList: { showModelFetcher: true },
  name: 'Jina',
  settings: {
    sdkType: 'openai',
    showModelFetcher: true,
  },
  url: 'https://jina.ai/deepsearch',
};

export default Jina; 
