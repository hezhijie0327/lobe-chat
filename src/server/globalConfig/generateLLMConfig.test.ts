import { describe, expect, beforeEach, it } from 'vitest';
import { generateLLMConfig } from './generateLLMConfig';
import { ModelProvider } from '@/libs/agent-runtime'; // Real import
import { getLLMConfig } from '@/config/llm'; // Real import
import { extractEnabledModels, transformToChatModelCards } from '@/utils/parseModels'; // Real imports

// Define types for the return value of getLLMConfig
type LLMConfig = {
  ENABLED_AZURE_OPENAI: boolean;
  ENABLED_AWS_BEDROCK: boolean;
  ENABLED_OLLAMA: boolean;
  AZURE_MODEL_LIST: string;
  AWS_BEDROCK_MODEL_LIST: string;
  OLLAMA_MODEL_LIST: string;
  OLLAMA_PROXY_URL: string;
};

type ProviderConfig = {
  enabled: boolean;
  enabledModels: string[];
  serverModelCards: string[];
  fetchOnClient?: boolean;
};

describe('generateLLMConfig', () => {
  let mockLLMConfig: LLMConfig;

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

    // Make sure getLLMConfig is returning mock config in real scenario
    getLLMConfig.mockReturnValue(mockLLMConfig);  // Use mock return here if needed
  });

  it('should return correct configuration for Azure provider', () => {
    const config = generateLLMConfig();
    expect(config[ModelProvider.Azure]).toEqual<ProviderConfig>({
      enabled: true,
      enabledModels: ['azureModel1', 'azureModel2'],
      serverModelCards: ['azureModel1', 'azureModel2'],
      fetchOnClient: undefined,
    });
  });

  it('should return correct configuration for Bedrock provider', () => {
    mockLLMConfig.ENABLED_AWS_BEDROCK = true;
    const config = generateLLMConfig();
    expect(config[ModelProvider.Bedrock]).toEqual<ProviderConfig>({
      enabled: true,
      enabledModels: ['bedrockModel1'],
      serverModelCards: ['bedrockModel1'],
    });
  });

  it('should return correct configuration for Ollama provider', () => {
    mockLLMConfig.ENABLED_OLLAMA = true;
    const config = generateLLMConfig();
    expect(config[ModelProvider.Ollama]).toEqual<ProviderConfig>({
      enabled: true,
      enabledModels: ['ollamaModel1'],
      serverModelCards: ['ollamaModel1'],
      fetchOnClient: false,
    });
  });

  it('should handle empty or undefined model list correctly', () => {
    mockLLMConfig.AZURE_MODEL_LIST = '';
    const config = generateLLMConfig();
    expect(config[ModelProvider.Azure]).toEqual<ProviderConfig>({
      enabled: true,
      enabledModels: [],
      serverModelCards: [],
    });
  });

  it('should return correct enabled models and serverModelCards for each provider', () => {
    const config = generateLLMConfig();
    expect(config[ModelProvider.Azure].enabledModels).toEqual(['azureModel1', 'azureModel2']);
    expect(config[ModelProvider.Bedrock].enabledModels).toEqual(['bedrockModel1']);
    expect(config[ModelProvider.Ollama].enabledModels).toEqual(['ollamaModel1']);
  });
});
