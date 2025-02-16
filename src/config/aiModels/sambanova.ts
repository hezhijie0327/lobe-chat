import { AIChatModelCard } from '@/types/aiModel';

const sambanovaChatModels: AIChatModelCard[] = [
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Meta-Llama-3.3-70B-Instruct',
    pricing: {
      input: 0.6,
      output: 1.2
    },
    type: 'chat'
  },
  {
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Meta-Llama-3.2-1B-Instruct',
    pricing: {
      input: 0.04,
      output: 0.08
    },
    type: 'chat'
  },
  {
    contextWindowTokens: 8000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Meta-Llama-3.2-3B-Instruct',
    pricing: {
      input: 0.08,
      output: 0.16
    },
    type: 'chat'
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 4000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Llama-3.2-11B-Vision-Instruct',
    pricing: {
      input: 0.15,
      output: 0.30
    },
    type: 'chat'
  },
  {
    abilities: {
      vision: true,
    },
    contextWindowTokens: 4000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Llama-3.2-90B-Vision-Instruct	',
    pricing: {
      input: 0.8,
      output: 1.6
    },
    type: 'chat'
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Meta-Llama-3.1-8B-Instruct',
    pricing: {
      input: 0.1,
      output: 0.2
    },
    type: 'chat'
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 128_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Meta-Llama-3.1-70B-Instruct',
    pricing: {
      input: 0.6,
      output: 1.2
    },
    type: 'chat'
  },
  {
    abilities: {
      functionCall: true,
    },
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Meta-Llama-3.1-405B-Instruct',
    pricing: {
      input: 5,
      output: 10
    },
    type: 'chat'
  },
  {
    contextWindowTokens: 16_000,
    description: '',
    displayName: 'Llama 3.1 Tulu 3 405B',
    enabled: true,
    id: 'Llama-3.1-Tulu-3-405B',
    pricing: {
      input: 0.7,
      output: 1.4
    },
    type: 'chat'
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 4000,
    description: '',
    displayName: 'DeepSeek R1',
    enabled: true,
    id: 'DeepSeek-R1',
    pricing: {
      input: 5,
      output: 7
    },
    type: 'chat'
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 32_000,
    description: '',
    displayName: 'DeepSeek R1 Distill Llama 70B',
    enabled: true,
    id: 'DeepSeek-R1-Distill-Llama-70B',
    pricing: {
      input: 0.7,
      output: 1.4
    },
    type: 'chat'
  },
  {
    abilities: {
      reasoning: true,
    },
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'QwQ-32B-Preview',
    pricing: {
      input: 1.5,
      output: 3
    },
    type: 'chat'
  },
  {
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Qwen2.5-72B-Instruct',
    pricing: {
      input: 2,
      output: 4
    },
    type: 'chat'
  },
  {
    contextWindowTokens: 16_000,
    description: '',
    displayName: '',
    enabled: true,
    id: 'Qwen2.5-Coder-32B-Instruct',
    pricing: {
      input: 1.5,
      output: 3
    },
    type: 'chat'
  },
]

export const allModels = [...sambanovaChatModels];

export default allModels;
