import { generateLLMConfig } from './generateLLMConfig';
import { describe, expect, it, vi } from 'vitest';

// 模拟所有需要的 provider cards
vi.mock('@/config/modelProviders', async () => ({
  ai21ProviderCard: {},
  anthropicProviderCard: {},
  azureProviderCard: {},
  bedrockProviderCard: {
    chatModels: ['bedrockModel1', 'bedrockModel2'],
  },
  googleProviderCard: {},
  mistralProviderCard: {},
  ollamaProviderCard: {
    chatModels: ['ollamaModel1', 'ollamaModel2'],
  },
  openAIProviderCard: {},
  zhipuProviderCard: {},
}));

// 模拟环境变量
vi.mock('@/utils/env', () => ({
  ENABLED_AZURE_OPENAI: true,
  ENABLED_AWS_BEDROCK: true, 
  ENABLED_OLLAMA: true,
  AZURE_MODEL_LIST: 'azureModels',
  AWS_BEDROCK_MODEL_LIST: 'bedrockModels',
  OLLAMA_MODEL_LIST: 'ollamaModels',
  OLLAMA_PROXY_URL: '',
}));

describe('generateLLMConfig', () => {
  it('should generate correct LLM config for Azure, Bedrock, and Ollama', () => {
    const config = generateLLMConfig();
    
    // Test Azure provider configuration
    expect(config.azure).toEqual({
      enabled: true,
      enabledModels: ['azureModels'],
      serverModelCards: [],
    });

    // Test Bedrock provider configuration  
    expect(config.bedrock).toEqual({
      enabled: true,
      enabledModels: ['bedrockModels'],
      serverModelCards: ['bedrockModel1', 'bedrockModel2'],
    });

    // Test Ollama provider configuration
    expect(config.ollama).toEqual({
      enabled: true,
      enabledModels: ['ollamaModels'], 
      fetchOnClient: true,  // Because OLLAMA_PROXY_URL is mocked as empty
      serverModelCards: ['ollamaModel1', 'ollamaModel2'],
    });
  });
});
