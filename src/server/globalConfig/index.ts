import { appEnv, getAppConfig } from '@/config/app';
import { authEnv } from '@/config/auth';
import { fileEnv } from '@/config/file';
import { langfuseEnv } from '@/config/langfuse';

import { enableNextAuth } from '@/const/auth';
import { parseSystemAgent } from '@/server/globalConfig/parseSystemAgent';
import { GlobalServerConfig } from '@/types/serverConfig';
import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels';

import { parseAgentConfig } from './parseDefaultAgent';

import { ModelProvider } from '@/libs/agent-runtime';
import { getLLMConfig } from '@/config/llm';
import * as ProviderCards from '@/config/modelProviders';
import { ModelProviderCard } from '@/types/llm';

export const generateLanguageModelConfig = () => {
  const llmConfig = getLLMConfig() as Record<string, any>;
  const config: Record<ModelProvider, any> = {} as Record<ModelProvider, any>;

  const specialConfigKeys: Partial<Record<ModelProvider, { enabled: string; modelList: string }>> = {
    [ModelProvider.Bedrock]: {
      enabled: 'ENABLED_AWS_BEDROCK',
      modelList: 'AWS_BEDROCK_MODEL_LIST',
    },
  };

  Object.values(ModelProvider).forEach((provider) => {
    const { enabled: enabledKey, modelList: modelListKey } = specialConfigKeys[provider] ?? {
      enabled: `ENABLED_${provider.toUpperCase()}`,
      modelList: `${provider.toUpperCase()}_MODEL_LIST`,
    };

    const cardKey = `${provider.charAt(0).toUpperCase()}${provider.slice(1)}ProviderCard`;
    const providerCard = ProviderCards[cardKey as keyof typeof ProviderCards];

    const hasChatModels = providerCard && typeof providerCard === 'object' && 'chatModels' in providerCard;

    const isAzure = provider === ModelProvider.Azure;
    const isOllama = provider === ModelProvider.Ollama;

    config[provider] = {
      enabled: llmConfig[enabledKey],
      enabledModels: extractEnabledModels(
        llmConfig[modelListKey],
        isAzure
      ),
      serverModelCards: transformToChatModelCards({
        defaultChatModels: isAzure ? [] : (hasChatModels ? providerCard.chatModels : []),
        modelString: llmConfig[modelListKey],
        ...(isAzure && { withDeploymentName: true }),
      }),
      ...(isOllama && {
        fetchOnClient: !llmConfig.OLLAMA_PROXY_URL,
      }),
    };
  });

  return config;
};

export const getServerGlobalConfig = () => {
  const { ACCESS_CODES, DEFAULT_AGENT_CONFIG } = getAppConfig();

  const config: GlobalServerConfig = {
    defaultAgent: {
      config: parseAgentConfig(DEFAULT_AGENT_CONFIG),
    },
    enableUploadFileToServer: !!fileEnv.S3_SECRET_ACCESS_KEY,
    enabledAccessCode: ACCESS_CODES?.length > 0,
    enabledOAuthSSO: enableNextAuth,
    languageModel: generateLanguageModelConfig(),
    oAuthSSOProviders: authEnv.NEXT_AUTH_SSO_PROVIDERS.trim().split(/[,，]/),
    systemAgent: parseSystemAgent(appEnv.SYSTEM_AGENT),
    telemetry: {
      langfuse: langfuseEnv.ENABLE_LANGFUSE,
    },
  };

  return config;
};

export const getServerDefaultAgentConfig = () => {
  const { DEFAULT_AGENT_CONFIG } = getAppConfig();

  return parseAgentConfig(DEFAULT_AGENT_CONFIG) || {};
};
