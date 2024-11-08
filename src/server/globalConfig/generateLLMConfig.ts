import { getLLMConfig } from '@/config/llm';
import * as ProviderCards from '@/config/modelProviders';

import { ModelProvider } from '@/libs/agent-runtime';

import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels';

export const generateLLMConfig = (
  providerSpecificConfigs: Partial<Record<ModelProvider, Record<string, any>>>
) => {
  const llmConfig = getLLMConfig() as Record<string, any>;
  const config: Record<ModelProvider, any> = {} as Record<ModelProvider, any>;

  Object.values(ModelProvider).forEach((provider) => {
    const enabledKey = `ENABLED_${provider.toUpperCase()}`;
    const modelListKey = `${provider.toUpperCase()}_MODEL_LIST`;
    const providerCard = ProviderCards[`${provider}ProviderCard` as keyof typeof ProviderCards];

    config[provider] = {
      enabled: llmConfig[enabledKey],
      enabledModels: extractEnabledModels(llmConfig[modelListKey]),
      serverModelCards: transformToChatModelCards({
        defaultChatModels: providerCard && typeof providerCard === 'object' && 'chatModels' in providerCard
          ? providerCard.chatModels
          : [],
        modelString: llmConfig[modelListKey],
      }),
      ...(providerSpecificConfigs[provider] || {}),
    };
  });

  return config;
};
