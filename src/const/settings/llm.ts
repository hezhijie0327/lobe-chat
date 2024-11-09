import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { ModelProviderCard } from '@/types/llm';
import { UserModelProviderConfig } from '@/types/user/settings';

export const DEFAULT_LLM_CONFIG: UserModelProviderConfig = Object.keys(ModelProvider).reduce((config, providerKey) => {
  const provider = ModelProvider[providerKey as keyof typeof ModelProvider]; 
  console.log(provider)
  
  const providerCard = ProviderCards[`${providerKey}ProviderCard` as keyof typeof ProviderCards] as ModelProviderCard;
  console.log(providerCard)

  config[provider] = {
    enabled: provider === ModelProvider.Ollama || provider === ModelProvider.OpenAI,
    enabledModels: providerCard ? ProviderCards.filterEnabledModels(providerCard) : [],
    ...(provider === ModelProvider.Ollama && { fetchOnClient: true }),
  };

  console.log(config[provider]);

  return config;
}, {} as UserModelProviderConfig);

console.log(DEFAULT_LLM_CONFIG);

export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';

export const DEFAULT_PROVIDER = ModelProvider.OpenAI;
