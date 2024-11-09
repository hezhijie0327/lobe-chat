import { generateLLMConfig } from './generateLLMConfig';
import { describe, expect, it, vi } from 'vitest';

// 使用 importOriginal 保持原始导出,只模拟我们需要的部分
vi.mock('@/config/modelProviders', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // 保持其他 provider cards 不变
    bedrockProviderCard: {
      ...actual.bedrockProviderCard,
      chatModels: ['bedrockModel1', 'bedrockModel2'],
    },
    ollamaProviderCard: {
      ...actual.ollamaProviderCard,
      chatModels: ['ollamaModel1', 'ollamaModel2'],
    },
  };
});

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
    
    expect(config.azure).toEqual({
      enabled: true,
      enabledModels: ['azureModels'],
      serverModelCards: [],
    });

    expect(config.bedrock).toEqual({
      enabled: true,
      enabledModels: ['bedrockModels'],
      serverModelCards: ['bedrockModel1', 'bedrockModel2'],
    });

    expect(config.ollama).toEqual({
      enabled: true,
      enabledModels: ['ollamaModels'], 
      fetchOnClient: true,
      serverModelCards: ['ollamaModel1', 'ollamaModel2'],
    });
  });
});
