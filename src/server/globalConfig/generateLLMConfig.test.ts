import { describe, expect, it, vi } from 'vitest';

import { generateLLMConfig } from './generateLLMConfig';

import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels';
import { getLLMConfig } from '@/config/llm';

vi.mock('@/config/llm', () => ({
  getLLMConfig: vi.fn(),
}));

vi.mock('@/config/modelProviders', () => ({
  AzureProviderCard: {
    chatModels: ['gpt-3.5', 'gpt-4'],
  },
  BedrockProviderCard: {
    chatModels: ['bedrock-1', 'bedrock-2'],
  },
}));

vi.mock('@/utils/parseModels', () => ({
  extractEnabledModels: vi.fn(),
  transformToChatModelCards: vi.fn(),
}));

describe('generateLLMConfig', () => {
  it('should generate LLM configuration with Azure provider correctly', () => {
    const mockConfig = {
      ENABLED_AZURE_OPENAI: true,
      AZURE_MODEL_LIST: 'gpt-4, gpt-3.5',
    };

    getLLMConfig.mockReturnValue(mockConfig);
    extractEnabledModels.mockReturnValue(['gpt-4', 'gpt-3.5']);
    transformToChatModelCards.mockReturnValue([
      { model: 'gpt-4' },
      { model: 'gpt-3.5' },
    ]);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: true,
      enabledModels: ['gpt-4', 'gpt-3.5'],
      serverModelCards: [
        { model: 'gpt-4' },
        { model: 'gpt-3.5' },
      ],
      fetchOnClient: undefined,
    });
  });

  it('should generate LLM configuration with Bedrock provider correctly', () => {
    const mockConfig = {
      ENABLED_AWS_BEDROCK: true,
      AWS_BEDROCK_MODEL_LIST: 'bedrock-1, bedrock-2',
    };

    getLLMConfig.mockReturnValue(mockConfig);
    extractEnabledModels.mockReturnValue(['bedrock-1', 'bedrock-2']);
    transformToChatModelCards.mockReturnValue([
      { model: 'bedrock-1' },
      { model: 'bedrock-2' },
    ]);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Bedrock]).toEqual({
      enabled: true,
      enabledModels: ['bedrock-1', 'bedrock-2'],
      serverModelCards: [
        { model: 'bedrock-1' },
        { model: 'bedrock-2' },
      ],
    });
  });

  it('should handle OLLAMA provider configuration correctly', () => {
    const mockConfig = {
      ENABLED_OLLAMA: true,
      OLLAMA_PROXY_URL: '',
    };

    getLLMConfig.mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Ollama]).toEqual({
      enabled: true,
      enabledModels: undefined,
      serverModelCards: [],
      fetchOnClient: true,
    });
  });

  it('should handle the case when no provider is enabled', () => {
    const mockConfig = {
      ENABLED_AZURE_OPENAI: false,
      ENABLED_AWS_BEDROCK: false,
      ENABLED_OLLAMA: false,
    };

    getLLMConfig.mockReturnValue(mockConfig);

    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure].enabled).toBe(false);
    expect(config[ModelProvider.Bedrock].enabled).toBe(false);
    expect(config[ModelProvider.Ollama].enabled).toBe(false);
  });
});
