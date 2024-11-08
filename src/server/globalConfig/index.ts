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
  const config: Record<string, any> = {};

  Object.entries(ModelProvider).forEach(([key, id]) => {
    const upperId = id.toUpperCase();
    const modelEnabled = `ENABLED_${upperId}`;
    const modelList = `${upperId}_MODEL_LIST`;
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
        config[id].enabled = AWS_BEDROCK_ENABLED;
        config[id].enabledModels = extractEnabledModels(AWS_BEDROCK_MODEL_LIST);
        config[id].envModelList = AWS_BEDROCK_MODEL_LIST;
        break;
      }
      case 'ollama': {
        config[id].fetchOnClient = !OLLAMA_PROXY_URL;
        break;
      }
    }
  });

  return config;
};


export const getServerGlobalConfig = () => {
  const { ACCESS_CODES, DEFAULT_AGENT_CONFIG } = getAppConfig();

  const {
    ENABLED_OPENAI,
    OPENAI_MODEL_LIST,

    ENABLED_MOONSHOT,
    MOONSHOT_MODEL_LIST,

    ENABLED_ZHIPU,
    ZHIPU_MODEL_LIST,

    ENABLED_AWS_BEDROCK,
    AWS_BEDROCK_MODEL_LIST,

    ENABLED_GOOGLE,
    GOOGLE_MODEL_LIST,

    ENABLED_GROQ,
    GROQ_MODEL_LIST,

    ENABLED_GITHUB,
    GITHUB_MODEL_LIST,

    ENABLED_HUNYUAN,
    HUNYUAN_MODEL_LIST,

    ENABLED_DEEPSEEK,
    DEEPSEEK_MODEL_LIST,

    ENABLED_PERPLEXITY,
    PERPLEXITY_MODEL_LIST,

    ENABLED_ANTHROPIC,
    ANTHROPIC_MODEL_LIST,

    ENABLED_MINIMAX,
    MINIMAX_MODEL_LIST,

    ENABLED_MISTRAL,
    MISTRAL_MODEL_LIST,

    ENABLED_NOVITA,
    NOVITA_MODEL_LIST,

    ENABLED_QWEN,
    QWEN_MODEL_LIST,

    ENABLED_STEPFUN,
    STEPFUN_MODEL_LIST,

    ENABLED_BAICHUAN,
    BAICHUAN_MODEL_LIST,

    ENABLED_TAICHU,
    TAICHU_MODEL_LIST,

    ENABLED_AI21,
    AI21_MODEL_LIST,

    ENABLED_AI360,
    AI360_MODEL_LIST,

    ENABLED_SENSENOVA,
    SENSENOVA_MODEL_LIST,

    ENABLED_SILICONCLOUD,
    SILICONCLOUD_MODEL_LIST,

    ENABLED_UPSTAGE,
    UPSTAGE_MODEL_LIST,

    ENABLED_SPARK,
    SPARK_MODEL_LIST,

    ENABLED_AZURE_OPENAI,
    AZURE_MODEL_LIST,

    ENABLED_OLLAMA,
    OLLAMA_MODEL_LIST,
    OLLAMA_PROXY_URL,

    ENABLED_OPENROUTER,
    OPENROUTER_MODEL_LIST,

    ENABLED_ZEROONE,
    ZEROONE_MODEL_LIST,

    ENABLED_TOGETHERAI,
    TOGETHERAI_MODEL_LIST,

    ENABLED_FIREWORKSAI,
    FIREWORKSAI_MODEL_LIST,

    ENABLED_WENXIN,
    WENXIN_MODEL_LIST,

    ENABLED_HUGGINGFACE,
    HUGGINGFACE_MODEL_LIST,
  } = getLLMConfig();

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
