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
import { DEFAULT_MODEL_PROVIDER_LIST } from '@/config/modelProviders';

export const generateLanguageModelConfig = () => {
  const config: Record<string, any> = {};

  Object.entries(ModelProvider).forEach(([key, id]) => {
    const upperId = id.toUpperCase();
    const modelEnabled = process.env[`ENABLED_${upperId}`] ?? false;
    const modelList = process.env[`${upperId}_MODEL_LIST`];
    const providerCardName = `${key}ProviderCard`;

    const providerCard = DEFAULT_MODEL_PROVIDER_LIST.find(
      (provider) => provider.constructor.name === providerCardName
    );

    config[id] = {
      enabled: modelEnabled,
      enabledModels: extractEnabledModels(modelList),
      serverModelCards: transformToChatModelCards({
        defaultChatModels: providerCard?.chatModels || [],
        modelString: modelList,
      }),
      ...(id === 'azure' && { serverModelCards: { withDeploymentName: true } }),
      ...(id === 'bedrock' && { 
        enabled: process.env.AWS_BEDROCK_ENABLED,
        enabledModels: extractEnabledModels(process.env.AWS_BEDROCK_MODEL_LIST),
      }),
      ...(id === 'ollama' && { fetchOnClient: !process.env.OLLAMA_PROXY_URL }),
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
