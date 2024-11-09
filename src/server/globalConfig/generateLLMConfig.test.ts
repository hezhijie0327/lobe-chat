import { describe, it, expect, vi, beforeEach } from 'vitest';

import { generateLLMConfig } from './generateLLMConfig';

import { getLLMConfig } from '@/config/llm';
import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';

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

describe('generateLLMConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确处理 Azure 配置', () => {
    vi.mocked(getLLMConfig).mockReturnValue({
      ENABLED_AZURE_OPENAI: true,
      AZURE_MODEL_LIST: 'gpt-4,gpt-35-turbo',
    });

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
    vi.mocked(getLLMConfig).mockReturnValue({
      ENABLED_AWS_BEDROCK: true,
      AWS_BEDROCK_MODEL_LIST: 'anthropic.claude-v2',
    });

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
    vi.mocked(getLLMConfig).mockReturnValue({
      ENABLED_OLLAMA: true,
      OLLAMA_MODEL_LIST: 'llama2',
      OLLAMA_PROXY_URL: 'http://localhost:11434',
    });

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
    vi.mocked(getLLMConfig).mockReturnValue({
      ENABLED_OLLAMA: true,
      OLLAMA_MODEL_LIST: 'llama2',
    });

    const config = generateLLMConfig();

    expect(config[ModelProvider.Ollama].fetchOnClient).toBe(true);
  });

  it('应该处理禁用的提供商', () => {
    vi.mocked(getLLMConfig).mockReturnValue({
      ENABLED_AZURE_OPENAI: false,
      AZURE_MODEL_LIST: '',
    });

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: false,
      enabledModels: [],
      serverModelCards: [],
    });
  });

  it('应该处理空的模型列表', () => {
    vi.mocked(getLLMConfig).mockReturnValue({
      ENABLED_AZURE_OPENAI: true,
      AZURE_MODEL_LIST: '',
    });

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: true,
      enabledModels: [],
      serverModelCards: [],
    });
  });
});
