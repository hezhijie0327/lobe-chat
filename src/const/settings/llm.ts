import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { ModelProviderCard } from '@/types/llm';
import { UserModelProviderConfig } from '@/types/user/settings';

export const DEFAULT_LLM_CONFIG: UserModelProviderConfig = Object.keys(ModelProvider).reduce((config, provider) => {
  const providerCard = ProviderCards[`${provider}ProviderCard` as keyof typeof ProviderCards] as ModelProviderCard;

  config[provider] = {
    enabled: provider === 'Ollama' || provider === 'OpenAI',
    enabledModels: providerCard ? ProviderCards.filterEnabledModels(providerCard) : [],
    ...(provider === 'Ollama' && { fetchOnClient: true }),
  };

  console.log(config[provider])

  return config;
}, {} as UserModelProviderConfig);

export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';

export const DEFAULT_PROVIDER = ModelProvider.OpenAI;
