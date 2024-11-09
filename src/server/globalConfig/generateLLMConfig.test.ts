import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLLMConfig } from '@/config/llm';
import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { generateLLMConfig } from './generateLLMConfig';

// Mock the config and provider cards
vi.mock('@/config/llm');
vi.mock('@/config/modelProviders', () => ({
  AzureProviderCard: {
    chatModels: [
      { name: 'gpt-4', label: 'GPT-4' },
      { name: 'gpt-35-turbo', label: 'GPT-3.5 Turbo' }
    ]
  },
  BedrockProviderCard: {
    chatModels: [
      { name: 'anthropic.claude-v2', label: 'Claude V2' }
    ]
  },
  OllamaProviderCard: {
    chatModels: [
      { name: 'llama2', label: 'Llama 2' }
    ]
  }
}));

// 创建基础配置对象
const createBaseLLMConfig = () => ({
  // 基本服务开关
  ENABLED_OPENAI: false,
  ENABLED_AZURE_OPENAI: false,
  ENABLED_ZHIPU: false,
  ENABLED_DEEPSEEK: false,
  ENABLED_GOOGLE: false,
  ENABLED_MOONSHOT: false,
  ENABLED_PERPLEXITY: false,
  ENABLED_ANTHROPIC: false,
  ENABLED_AWS_BEDROCK: false,
  ENABLED_GROQ: false,
  ENABLED_MISTRAL: false,
  ENABLED_OLLAMA: false,
  ENABLED_MINIMAX: false,
  ENABLED_BAICHUAN: false,
  ENABLED_CLOUDFLARE: false,
  ENABLED_XINFERENCE: false,
  ENABLED_TONGYI: false,
  ENABLED_SENSENOVA: false,
  ENABLED_GITHUB: false,
  ENABLED_OPENROUTER: false,
  ENABLED_ZEROONE: false,
  ENABLED_TOGETHERAI: false,
  ENABLED_CLAUDE: false,
  ENABLED_PALM: false,
  ENABLED_DATABRICKS: false,
  ENABLED_COHERE: false,
  ENABLED_HUGGINGFACE: false,
  ENABLED_REPLICATE: false,
  ENABLED_AWS_CLAUDE: false,
  ENABLED_VERTEX_AI: false,
  ENABLED_YI: false,
  
  // API 密钥和配置
  OPENAI_API_KEY: '',
  AZURE_API_VERSION: '',
  AZURE_API_KEY: '',
  ZHIPU_API_KEY: '',
  DEEPSEEK_API_KEY: '',
  GOOGLE_API_KEY: '',
  MOONSHOT_API_KEY: '',
  PERPLEXITY_API_KEY: '',
  ANTHROPIC_API_KEY: '',
  AWS_REGION: '',
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',
  GROQ_API_KEY: '',
  MISTRAL_API_KEY: '',
  MINIMAX_GROUP_ID: '',
  MINIMAX_API_KEY: '',
  BAICHUAN_API_KEY: '',
  CLOUDFLARE_API_KEY: '',
  TONGYI_API_KEY: '',
  SENSENOVA_API_KEY: '',
  GITHUB_API_KEY: '',
  OPENROUTER_API_KEY: '',
  ZEROONE_API_KEY: '',
  TOGETHERAI_API_KEY: '',
  DATABRICKS_ACCESS_TOKEN: '',
  COHERE_API_KEY: '',
  HUGGINGFACE_API_KEY: '',
  REPLICATE_API_TOKEN: '',
  VERTEX_PROJECT_ID: '',
  
  // 模型列表配置
  OPENAI_MODEL_LIST: '',
  AZURE_MODEL_LIST: '',
  ZHIPU_MODEL_LIST: '',
  DEEPSEEK_MODEL_LIST: '',
  GOOGLE_MODEL_LIST: '',
  MOONSHOT_MODEL_LIST: '',
  PERPLEXITY_MODEL_LIST: '',
  ANTHROPIC_MODEL_LIST: '',
  AWS_BEDROCK_MODEL_LIST: '',
  GROQ_MODEL_LIST: '',
  MISTRAL_MODEL_LIST: '',
  OLLAMA_MODEL_LIST: '',
  MINIMAX_MODEL_LIST: '',
  BAICHUAN_MODEL_LIST: '',
  CLOUDFLARE_MODEL_LIST: '',
  XINFERENCE_MODEL_LIST: '',
  TONGYI_MODEL_LIST: '',
  SENSENOVA_MODEL_LIST: '',
  GITHUB_MODEL_LIST: '',
  OPENROUTER_MODEL_LIST: '',
  ZEROONE_MODEL_LIST: '',
  TOGETHERAI_MODEL_LIST: '',
  CLAUDE_MODEL_LIST: '',
  PALM_MODEL_LIST: '',
  DATABRICKS_MODEL_LIST: '',
  COHERE_MODEL_LIST: '',
  HUGGINGFACE_MODEL_LIST: '',
  REPLICATE_MODEL_LIST: '',
  AWS_CLAUDE_MODEL_LIST: '',
  VERTEX_AI_MODEL_LIST: '',
  YI_MODEL_LIST: '',
  
  // 额外配置
  OPENAI_PROXY_URL: '',
  ANTHROPIC_PROXY_URL: '',
  AZURE_API_ENDPOINT: '',
  OLLAMA_PROXY_URL: ''
}) as const;

describe('generateLLMConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确处理 Azure 配置', () => {
    const mockConfig = {
      ...createBaseLLMConfig(),
      ENABLED_AZURE_OPENAI: true,
      AZURE_MODEL_LIST: 'gpt-4,gpt-35-turbo',
    };
    vi.mocked(getLLMConfig).mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: true,
      enabledModels: ['gpt-4', 'gpt-35-turbo'],
      serverModelCards: expect.arrayContaining([
        expect.objectContaining({
          name: 'gpt-4',
          label: 'GPT-4',
        }),
        expect.objectContaining({
          name: 'gpt-35-turbo',
          label: 'GPT-3.5 Turbo',
        }),
      ]),
    });
  });

  it('应该正确处理 Bedrock 配置', () => {
    const mockConfig = {
      ...createBaseLLMConfig(),
      ENABLED_AWS_BEDROCK: true,
      AWS_BEDROCK_MODEL_LIST: 'anthropic.claude-v2',
    };
    vi.mocked(getLLMConfig).mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Bedrock]).toEqual({
      enabled: true,
      enabledModels: ['anthropic.claude-v2'],
      serverModelCards: expect.arrayContaining([
        expect.objectContaining({
          name: 'anthropic.claude-v2',
          label: 'Claude V2',
        }),
      ]),
    });
  });

  it('应该正确处理 Ollama 配置', () => {
    const mockConfig = {
      ...createBaseLLMConfig(),
      ENABLED_OLLAMA: true,
      OLLAMA_MODEL_LIST: 'llama2',
      OLLAMA_PROXY_URL: 'http://localhost:11434',
    };
    vi.mocked(getLLMConfig).mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Ollama]).toEqual({
      enabled: true,
      enabledModels: ['llama2'],
      serverModelCards: expect.arrayContaining([
        expect.objectContaining({
          name: 'llama2',
          label: 'Llama 2',
        }),
      ]),
      fetchOnClient: false,
    });
  });

  it('当 OLLAMA_PROXY_URL 未设置时，fetchOnClient 应为 true', () => {
    const mockConfig = {
      ...createBaseLLMConfig(),
      ENABLED_OLLAMA: true,
      OLLAMA_MODEL_LIST: 'llama2',
    };
    vi.mocked(getLLMConfig).mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Ollama].fetchOnClient).toBe(true);
  });

  it('应该处理禁用的提供商', () => {
    const mockConfig = {
      ...createBaseLLMConfig(),
      ENABLED_AZURE_OPENAI: false,
      AZURE_MODEL_LIST: '',
    };
    vi.mocked(getLLMConfig).mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: false,
      enabledModels: [],
      serverModelCards: [],
    });
  });

  it('应该处理空的模型列表', () => {
    const mockConfig = {
      ...createBaseLLMConfig(),
      ENABLED_AZURE_OPENAI: true,
      AZURE_MODEL_LIST: '',
    };
    vi.mocked(getLLMConfig).mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: true,
      enabledModels: [],
      serverModelCards: [],
    });
  });
});
