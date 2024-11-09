import { generateLLMConfig } from './generateLLMConfig';

import { getLLMConfig } from '@/config/llm';
import * as ProviderCards from '@/config/modelProviders';
import { ModelProvider } from '@/libs/agent-runtime';
import { ModelProviderCard } from '@/types/llm';
import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels';

jest.mock('@/config/llm', () => ({
  getLLMConfig: jest.fn(),
}));

jest.mock('@/config/modelProviders', () => ({
  AzureProviderCard: { chatModels: ['azureModel1', 'azureModel2'] },
  BedrockProviderCard: { chatModels: ['bedrockModel1'] },
  OllamaProviderCard: { chatModels: ['ollamaModel1'] },
}));

jest.mock('@/utils/parseModels', () => ({
  extractEnabledModels: jest.fn(),
  transformToChatModelCards: jest.fn(),
}));

describe('generateLLMConfig', () => {
  let mockLLMConfig;

  beforeEach(() => {
    // Setup mock return values for getLLMConfig
    mockLLMConfig = {
      ENABLED_AZURE_OPENAI: true,
      ENABLED_AWS_BEDROCK: false,
      ENABLED_OLLAMA: true,
      AZURE_MODEL_LIST: 'azureModel1, azureModel2',
      AWS_BEDROCK_MODEL_LIST: 'bedrockModel1',
      OLLAMA_MODEL_LIST: 'ollamaModel1',
      OLLAMA_PROXY_URL: '',
    };

    (getLLMConfig as jest.Mock).mockReturnValue(mockLLMConfig);
    (extractEnabledModels as jest.Mock).mockImplementation((modelsList) => modelsList.split(',').map(model => model.trim()));
    (transformToChatModelCards as jest.Mock).mockImplementation(({ defaultChatModels }) => defaultChatModels);
  });

  it('should return correct configuration for Azure provider', () => {
    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: true,
      enabledModels: ['azureModel1', 'azureModel2'],
      serverModelCards: ['azureModel1', 'azureModel2'],
      fetchOnClient: undefined, // No Ollama proxy URL to trigger this
    });
  });

  it('should return correct configuration for Bedrock provider', () => {
    mockLLMConfig.ENABLED_AWS_BEDROCK = true; // Enable Bedrock
    const config = generateLLMConfig();

    expect(config[ModelProvider.Bedrock]).toEqual({
      enabled: true,
      enabledModels: ['bedrockModel1'],
      serverModelCards: ['bedrockModel1'],
    });
  });

  it('should return correct configuration for Ollama provider', () => {
    mockLLMConfig.ENABLED_OLLAMA = true; // Enable Ollama
    const config = generateLLMConfig();

    expect(config[ModelProvider.Ollama]).toEqual({
      enabled: true,
      enabledModels: ['ollamaModel1'],
      serverModelCards: ['ollamaModel1'],
      fetchOnClient: false, // Because OLLAMA_PROXY_URL is set to '' (non-empty)
    });
  });

  it('should handle empty or undefined model list correctly', () => {
    mockLLMConfig.AZURE_MODEL_LIST = ''; // No models for Azure
    const config = generateLLMConfig();

    expect(config[ModelProvider.Azure]).toEqual({
      enabled: true,
      enabledModels: [],
      serverModelCards: [],
    });
  });

  it('should return correct enabled models and serverModelCards for each provider', () => {
    const config = generateLLMConfig();

    // Checking that enabledModels match the list defined in LLMConfig
    expect(config[ModelProvider.Azure].enabledModels).toEqual(['azureModel1', 'azureModel2']);
    expect(config[ModelProvider.Bedrock].enabledModels).toEqual(['bedrockModel1']);
    expect(config[ModelProvider.Ollama].enabledModels).toEqual(['ollamaModel1']);
  });
});
