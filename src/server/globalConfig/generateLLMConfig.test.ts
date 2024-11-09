import { generateLLMConfig } from './generateLLMConfig';

import { describe, expect, it, vi } from 'vitest';

// Mock necessary imports using `vi.mock` from Vitest
vi.mock('@/config/llm', () => ({
  getLLMConfig: () => ({
    ENABLED_AZURE_OPENAI: true,
    ENABLED_AWS_BEDROCK: true,
    ENABLED_OLLAMA: true,
    AZURE_MODEL_LIST: 'azureModels',
    AWS_BEDROCK_MODEL_LIST: 'bedrockModels',
    OLLAMA_MODEL_LIST: 'ollamaModels',
    OLLAMA_PROXY_URL: '',
  }),
}));

vi.mock('@/config/modelProviders', () => ({
  BedrockProviderCard: { chatModels: ['bedrockModel1', 'bedrockModel2'] },
  OllamaProviderCard: { chatModels: ['ollamaModel1', 'ollamaModel2'] },
}));

vi.mock('@/utils/parseModels', () => ({
  extractEnabledModels: (modelList: string) => modelList.split(','),
  transformToChatModelCards: (params: any) => params.defaultChatModels,
}));

describe('generateLLMConfig', () => {
  it('should generate correct LLM config for Azure, Bedrock, and Ollama', () => {
    const config = generateLLMConfig();

    // Test for Azure provider
    expect(config.azure).toEqual({
      enabled: true,
      enabledModels: ['azureModels'],
      serverModelCards: [],
    });

    // Test for Bedrock provider
    expect(config.bedrock).toEqual({
      enabled: true,
      enabledModels: ['bedrockModels'],
      serverModelCards: ['bedrockModel1', 'bedrockModel2'],
    });

    // Test for Ollama provider
    expect(config.ollama).toEqual({
      enabled: true,
      enabledModels: ['ollamaModels'],
      fetchOnClient: true,  // Because OLLAMA_PROXY_URL is mocked as empty
      serverModelCards: ['ollamaModel1', 'ollamaModel2'],
    });
  });
});
