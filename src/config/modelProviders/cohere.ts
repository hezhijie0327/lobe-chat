import { ModelProviderCard } from '@/types/llm';

const Cohere: ModelProviderCard = {
  chatModels: [],
  checkModel: 'command-r7b-12-2024',
  description: 'Cohere',
  id: 'cohere',
  modelsUrl: 'https://docs.cohere.com/v2/docs/models',
  name: 'Cohere',
  settings: {
    proxyUrl: {
      placeholder: 'https://api.cohere.ai/compatibility/v1',
    },
    sdkType: 'openai',
  },
  url: 'https://cohere.com',
};

export default Cohere;
