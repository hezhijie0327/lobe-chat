import { ModelProviderCard } from '@/types/llm';

// ref https://huggingface.co/models?pipeline_tag=text-generation&sort=trending
const HuggingFace: ModelProviderCard = {
  chatModels: [
    {
      displayName: 'Llama 3.1 8B Instruct',
      enabled: true,
      functionCall: false,
      id: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
      tokens: 131_072,
    },
  ],
  checkModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
  id: 'huggingface',
  modelList: { showModelFetcher: true },
  name: 'Hugging Face',
};

export default HuggingFace;
