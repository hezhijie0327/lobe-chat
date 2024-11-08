import { appEnv, getAppConfig } from '@/config/app';
import { authEnv } from '@/config/auth';
import { fileEnv } from '@/config/file';
import { langfuseEnv } from '@/config/langfuse';
import { getLLMConfig } from '@/config/llm';
import {
  Ai21ProviderCard,
  Ai360ProviderCard,
  AnthropicProviderCard,
  BaichuanProviderCard,
  BedrockProviderCard,
  DeepSeekProviderCard,
  FireworksAIProviderCard,
  GithubProviderCard,
  GoogleProviderCard,
  GroqProviderCard,
  HuggingFaceProviderCard,
  HunyuanProviderCard,
  MinimaxProviderCard,
  MistralProviderCard,
  MoonshotProviderCard,
  NovitaProviderCard,
  OllamaProviderCard,
  OpenAIProviderCard,
  OpenRouterProviderCard,
  PerplexityProviderCard,
  QwenProviderCard,
  SenseNovaProviderCard,
  SiliconCloudProviderCard,
  SparkProviderCard,
  StepfunProviderCard,
  TaichuProviderCard,
  TogetherAIProviderCard,
  UpstageProviderCard,
  WenxinProviderCard,
  ZeroOneProviderCard,
  ZhiPuProviderCard,
} from '@/config/modelProviders';
import { enableNextAuth } from '@/const/auth';
import { parseSystemAgent } from '@/server/globalConfig/parseSystemAgent';
import { GlobalServerConfig } from '@/types/serverConfig';
import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels';

import { parseAgentConfig } from './parseDefaultAgent';

import { ModelProvider } from '@/libs/agent-runtime';

export const generateLanguageModelConfig = () => {
  const llmConfig = getLLMConfig();

  const config: Record<string, any> = {};

  Object.entries(ModelProvider).forEach(([key, id]) => {
    const upperId = id.toUpperCase();
    const modelEnabled = llmConfig[`ENABLED_${upperId}`];
    const modelList = llmConfig[`${upperId}_MODEL_LIST`];
    const providerCard = `${key}ProviderCard`;

    config[id] = {
      enabled: modelEnabled,
      enabledModels: extractEnabledModels(modelList),
      serverModelCards: transformToChatModelCards({
        defaultChatModels: providerCard?.chatModels || [],
        modelString: modelList,
      }),
    };

    switch (id) {
      case 'azure': {
        config[id].serverModelCards = {
          ...config[id].serverModelCards,
          withDeploymentName: true,
        };
        break;
      }
      case 'bedrock': {
        config[id].enabled = llmConfig.AWS_BEDROCK_ENABLED;
        config[id].enabledModels = extractEnabledModels(llmConfig.AWS_BEDROCK_MODEL_LIST);
        break;
      }
      case 'ollama': {
        config[id].fetchOnClient = !llmConfig.OLLAMA_PROXY_URL;
        break;
      }
    }
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
