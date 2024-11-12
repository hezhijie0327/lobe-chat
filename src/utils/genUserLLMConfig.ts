import * as ProviderCards from '@/config/modelProviders';

import { ModelProvider } from '@/libs/agent-runtime';

import { ModelProviderCard } from '@/types/llm';
import { UserModelProviderConfig } from '@/types/user/settings';

export const genUserLLMConfig = (): UserModelProviderConfig => {
  const specificConfig: Record<any, any> = {
    ollama: {
      enabled: true,
      fetchOnClient: true,
    },
    openai: {
      enabled: true,
    },
  };

  return Object.keys(ModelProvider).reduce((config, providerKey) => {
    const provider = ModelProvider[providerKey as keyof typeof ModelProvider];
    const providerCard = ProviderCards[`${providerKey}ProviderCard` as keyof typeof ProviderCards] as ModelProviderCard;
    const providerConfig = specificConfig[provider as keyof typeof specificConfig] || {};

    config[provider] = {
      enabled: providerConfig.enabled !== undefined ? providerConfig.enabled : false,
      enabledModels: providerCard ? ProviderCards.filterEnabledModels(providerCard) : [],
      ...(providerConfig.fetchOnClient !== undefined && { fetchOnClient: providerConfig.fetchOnClient }),
    };

    return config;
  }, {} as UserModelProviderConfig);
};
