import { ModelProviderCard } from '@/types/llm';

// ref https://docs.api.nvidia.com/nim/reference
// ref https://build.nvidia.com/explore/discover
const Nvidia: ModelProviderCard = {
  chatModels: [
    {
      displayName: 'Gemma 2 9B',
      enabled: true,
      functionCall: false,
      id: 'google/gemma-2-9b-it',
      tokens: 8192,
    },
    {
      displayName: 'Gemma 2 27B',
      enabled: true,
      functionCall: false,
      id: 'google/gemma-2-27b-it',
      tokens: 8192,
    },
    {
      displayName: 'LLaMA3 8B instruct',
      enabled: true,
      functionCall: false,
      id: 'meta/llama3-8b-instruct',
      tokens: 8192,
    },
    {
      displayName: 'LLaMA3 70B instruct',
      enabled: true,
      functionCall: false,
      id: 'meta/llama3-70b-instruct',
      tokens: 8192,
    },
    {
      displayName: 'Mixtral 8x7B Instruct',
      enabled: true,
      functionCall: false,
      id: 'mistralai/mixtral-8x7b-instruct-v0.1',
      tokens: 32_768,
    },
    {
      displayName: 'Mixtral 8x22B Instruct',
      enabled: true,
      functionCall: false,
      id: 'mistralai/mixtral-8x22b-instruct-v0.1',
      tokens: 65_536,
    },
    {
      displayName: 'Phi-3 Mini 128K Instruct',
      enabled: true,
      functionCall: false,
      id: 'microsoft/phi-3-mini-128k-instruct',
      tokens: 128_000,
    },
    {
      displayName: 'Phi-3 Small 128K Instruct',
      enabled: true,
      functionCall: false,
      id: 'microsoft/phi-3-small-128k-instruct',
      tokens: 128_000,
    },
    {
      displayName: 'Phi-3 Medium 128K Instruct',
      enabled: true,
      functionCall: false,
      id: 'microsoft/phi-3-medium-128k-instruct',
      tokens: 128_000,
    },
  ],
  checkModel: 'google/gemma-2-9b-it',
  id: 'nvidia',
  modelList: { showModelFetcher: true },
  name: 'Nvidia',
};

export default Nvidia;
