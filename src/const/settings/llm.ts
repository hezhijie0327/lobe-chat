import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { ModelProviderCard } from '@/types/llm';
import { UserModelProviderConfig } from '@/types/user/settings';

export const DEFAULT_LLM_CONFIG: UserModelProviderConfig = Object.keys(ModelProvider).reduce((config, providerKey) => {
  const providerCard = ProviderCards[`${providerKey}ProviderCard` as keyof typeof ProviderCards] as ModelProviderCard;

  config[providerKey] = {
    enabled: providerKey === ModelProvider.Ollama || providerKey === ModelProvider.OpenAI,
    enabledModels: providerCard ? ProviderCards.filterEnabledModels(providerCard) : [],
    ...(providerKey === ModelProvider.Ollama && { fetchOnClient: true }),
  };

  return config;
}, {} as UserModelProviderConfig);

export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';

export const DEFAULT_PROVIDER = ModelProvider.OpenAI;
