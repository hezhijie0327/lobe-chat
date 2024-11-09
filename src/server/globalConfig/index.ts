import { appEnv, getAppConfig } from '@/config/app';
import { authEnv } from '@/config/auth';
import { fileEnv } from '@/config/file';
import { langfuseEnv } from '@/config/langfuse';
import { enableNextAuth } from '@/const/auth';
import { parseSystemAgent } from '@/server/globalConfig/parseSystemAgent';
import { GlobalServerConfig } from '@/types/serverConfig';

import { parseAgentConfig } from './parseDefaultAgent';

import { getLLMConfig } from '@/config/llm';
import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { ModelProviderCard } from '@/types/llm';
import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels';

export const generateLLMConfig = () => {
  const config: Record<ModelProvider, any> = {} as Record<ModelProvider, any>;

  const llmConfig = getLLMConfig() as Record<string, any>;

  const providerSpecificConfigs: Partial<Record<ModelProvider, Record<string, any>>> = {
    [ModelProvider.Azure]: { serverModelCards: { withDeploymentName: true } },
    [ModelProvider.Bedrock]: {
      enabled: llmConfig['ENABLED_AWS_BEDROCK'],
      modelList: llmConfig['AWS_BEDROCK_MODEL_LIST'],
    },
    [ModelProvider.Ollama]: { fetchOnClient: !llmConfig.OLLAMA_PROXY_URL },
  };

  Object.values(ModelProvider).forEach((provider) => {
    const enabledKey = `ENABLED_${provider.toUpperCase()}`;
    const modelListKey = `${provider.toUpperCase()}_MODEL_LIST`;
    const providerCard = ProviderCards[`${provider}ProviderCard` as keyof typeof ProviderCards];

    config[provider] = {
      enabled: llmConfig[enabledKey],
      enabledModels: extractEnabledModels(llmConfig[modelListKey]),
      serverModelCards: transformToChatModelCards({
        // eslint-disable-next-line unicorn/no-useless-fallback-in-spread
        defaultChatModels: providerCard && typeof providerCard === 'object' && 'chatModels' in providerCard
          ? (providerCard as ModelProviderCard).chatModels
          : [],
        modelString: llmConfig[modelListKey],
      }),
      ...(providerSpecificConfigs[provider] || {}),
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
    languageModel: generateLLMConfig(),
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
