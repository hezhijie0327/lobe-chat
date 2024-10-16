import { ModelProviderCard } from '@/types/llm';

// ref: https://docs.together.ai/docs/chat-models
// ref: https://docs.together.ai/docs/vision-models
// ref: https://docs.together.ai/docs/function-calling
// ref: https://docs.together.ai/docs/language-and-code-models
// ref: https://www.together.ai/pricing
const TogetherAI: ModelProviderCard = {
  chatModels: [
    {
      description: '',
      displayName: 'Llama 3.2 8B Instruct Turbo',
      enabled: true,
      id: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
      tokens: 131_072,
    },
    {
      description: '',
      displayName: 'Llama 3.2 11B Vision Instruct Turbo (Free)',
      enabled: true,
      id: 'meta-llama/Llama-Vision-Free',
      tokens: 131_072,
      vision: true,
    },
    {
      description: '',
      displayName: 'Llama 3.2 11B Vision Instruct Turbo',
      enabled: true,
      id: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
      tokens: 131_072,
      vision: true,
    },
    {
      description: '',
      displayName: 'Llama 3.2 90B Vision Instruct Turbo',
      enabled: true,
      id: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
      tokens: 131_072,
      vision: true,
    },
    {
      description:
        'Llama 3.1 8B 模型采用FP8量化，支持高达131,072个上下文标记，是开源模型中的佼佼者，适合复杂任务，表现优异于许多行业基准。',
      displayName: 'Llama 3.1 8B Instruct Turbo',
      enabled: true,
      functionCall: true,
      id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      tokens: 131_072,
    },
    {
      description:
        'Llama 3.1 70B 模型经过精细调整，适用于高负载应用，量化至FP8提供更高效的计算能力和准确性，确保在复杂场景中的卓越表现。',
      displayName: 'Llama 3.1 70B Instruct Turbo',
      enabled: true,
      functionCall: true,
      id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      tokens: 131_072,
    },
    {
      description:
        '405B 的 Llama 3.1 Turbo 模型，为大数据处理提供超大容量的上下文支持，在超大规模的人工智能应用中表现突出。',
      displayName: 'Llama 3.1 405B Instruct Turbo',
      enabled: true,
      functionCall: true,
      id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
      tokens: 8192,
    },
    {
      description: 'Llama 3 8B Instruct Turbo 是一款高效能的大语言模型，支持广泛的应用场景。',
      displayName: 'Llama 3 8B Instruct Turbo',
      id: 'meta-llama/Meta-Llama-3-8B-Instruct-Turbo',
      tokens: 8192,
    },
    {
      description:
        'Llama 3 70B Instruct Turbo 提供卓越的语言理解和生成能力，适合最苛刻的计算任务。',
      displayName: 'Llama 3 70B Instruct Turbo',
      id: 'meta-llama/Meta-Llama-3-70B-Instruct-Turbo',
      tokens: 8192,
    },
    {
      description: 'Llama 3 8B Instruct Lite 适合资源受限的环境，提供出色的平衡性能。',
      displayName: 'Llama 3 8B Instruct Lite',
      id: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite',
      tokens: 8192,
    },
    {
      description: 'Llama 3 70B Instruct Lite 适合需要高效能和低延迟的环境。',
      displayName: 'Llama 3 70B Instruct Lite',
      id: 'meta-llama/Meta-Llama-3-70B-Instruct-Lite',
      tokens: 8192,
    },
    {
      description: 'Llama 3 8B Instruct Reference 提供多语言支持，涵盖丰富的领域知识。',
      displayName: 'Llama 3 8B Instruct Reference',
      id: 'meta-llama/Llama-3-8b-chat-hf',
      tokens: 8192,
    },
    {
      description: 'Llama 3 70B Instruct Reference 是功能强大的聊天模型，支持复杂的对话需求。',
      displayName: 'Llama 3 70B Instruct Reference',
      id: 'meta-llama/Llama-3-70b-chat-hf',
      tokens: 8192,
    },
    {
      description: 'LLaMA-2 Chat (13B) 提供优秀的语言处理能力和出色的交互体验。',
      displayName: 'LLaMA-2 Chat (13B)',
      id: 'meta-llama/Llama-2-13b-chat-hf',
      tokens: 4096,
    },
    {
      description: '',
      displayName: 'LLaMA-2 (70B)',
      id: 'meta-llama/Llama-2-70b-hf',
      tokens: 4096,
    },
    {
      description: 'Gemma 2 9B 由Google开发，提供高效的指令响应和综合能力。',
      displayName: 'Gemma 2 9B',
      enabled: true,
      id: 'google/gemma-2-9b-it',
      tokens: 8192,
    },
    {
      description: 'Gemma 2 27B 是一款通用大语言模型，具有优异的性能和广泛的应用场景。',
      displayName: 'Gemma 2 27B',
      enabled: true,
      id: 'google/gemma-2-27b-it',
      tokens: 8192,
    },
    {
      description: 'Gemma Instruct (2B) 提供基本的指令处理能力，适合轻量级应用。',
      displayName: 'Gemma Instruct (2B)',
      id: 'google/gemma-2b-it',
      tokens: 8192,
    },
    {
      description: 'Mistral (7B) Instruct v0.3 提供高效的计算能力和自然语言理解，适合广泛的应用。',
      displayName: 'Mistral (7B) Instruct v0.3',
      id: 'mistralai/Mistral-7B-Instruct-v0.3',
      tokens: 32_768,
    },
    {
      description: 'Mistral (7B) Instruct v0.2 提供改进的指令处理能力和更精确的结果。',
      displayName: 'Mistral (7B) Instruct v0.2',
      id: 'mistralai/Mistral-7B-Instruct-v0.2',
      tokens: 32_768,
    },
    {
      description: 'Mistral (7B) Instruct 以高性能著称，适用于多种语言任务。',
      displayName: 'Mistral (7B) Instruct',
      enabled: true,
      functionCall: true,
      id: 'mistralai/Mistral-7B-Instruct-v0.1',
      tokens: 8192,
    },
    {
      description: '',
      displayName: 'Mistral (7B)',
      id: 'mistralai/Mistral-7B-v0.1',
      tokens: 8192,
    },
    {
      description: 'Mixtral-8x7B Instruct (46.7B) 提供高容量的计算框架，适合大规模数据处理。',
      displayName: 'Mixtral-8x7B Instruct (46.7B)',
      enabled: true,
      functionCall: true,
      id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      tokens: 32_768,
    },
    {
      description: '',
      displayName: 'Mixtral-8x7B (46.7B)',
      id: 'mistralai/Mixtral-8x7B-v0.1',
      tokens: 32_768,
    },
    {
      description: 'Mixtral-8x22B Instruct (141B) 是一款超级大语言模型，支持极高的处理需求。',
      displayName: 'Mixtral-8x22B Instruct (141B)',
      enabled: true,
      id: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
      tokens: 65_536,
    },
    {
      description: 'DeepSeek LLM Chat (67B) 是创新的 AI 模型 提供深度语言理解和互动能力。',
      displayName: 'DeepSeek LLM Chat (67B)',
      enabled: true,
      id: 'deepseek-ai/deepseek-llm-67b-chat',
      tokens: 4096,
    },
    {
      description: '',
      displayName: 'Qwen 2.5 7B Instruct Turbo',
      enabled: true,
      id: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
      tokens: 32_768,
    },
    {
      description: '',
      displayName: 'Qwen 2.5 72B Instruct Turbo',
      enabled: true,
      id: 'Qwen/Qwen2.5-72B-Instruct-Turbo',
      tokens: 32_768,
    },
    {
      description: 'Qwen 2 Instruct (72B) 为企业级应用提供精准的指令理解和响应。',
      displayName: 'Qwen 2 Instruct (72B)',
      id: 'Qwen/Qwen2-72B-Instruct',
      tokens: 32_768,
    },
    {
      description: 'Qwen 1.5 Chat (72B) 提供快速响应和自然对话能力，适合多语言环境。',
      displayName: 'Qwen 1.5 Chat (72B)',
      id: 'Qwen/Qwen1.5-72B-Chat',
      tokens: 32_768,
    },
    {
      description: 'Qwen 1.5 Chat (110B) 是一款高效能的对话模型，支持复杂对话场景。',
      displayName: 'Qwen 1.5 Chat (110B)',
      id: 'Qwen/Qwen1.5-110B-Chat',
      tokens: 32_768,
    },
    {
      description: 'DBRX Instruct 提供高可靠性的指令处理能力，支持多行业应用。',
      displayName: 'DBRX Instruct',
      id: 'databricks/dbrx-instruct',
      tokens: 32_768,
    },
    {
      description: 'Upstage SOLAR Instruct v1 (11B) 适用于精细化指令任务，提供出色的语言处理能力。',
      displayName: 'Upstage SOLAR Instruct v1 (11B)',
      id: 'upstage/SOLAR-10.7B-Instruct-v1.0',
      tokens: 4096,
    },
    {
      description: 'Nous Hermes 2 - Mixtral 8x7B-DPO (46.7B) 是高精度的指令模型，适用于复杂计算。',
      displayName: 'Nous Hermes 2 - Mixtral 8x7B-DPO (46.7B)',
      id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
      tokens: 32_768,
    },
    {
      description: 'Nous Hermes-2 Yi (34B) 提供优化的语言输出和多样化的应用可能。',
      displayName: 'Nous Hermes-2 Yi (34B)',
      id: 'NousResearch/Nous-Hermes-2-Yi-34B',
      tokens: 4096,
    },
    {
      description: 'MythoMax-L2 (13B) 是一种创新模型，适合多领域应用和复杂任务。',
      displayName: 'MythoMax-L2 (13B)',
      id: 'Gryphe/MythoMax-L2-13b',
      tokens: 4096,
    },
    {
      description: 'StripedHyena Nous (7B) 通过高效的策略和模型架构，提供增强的计算能力。',
      displayName: 'StripedHyena Nous (7B)',
      id: 'togethercomputer/StripedHyena-Nous-7B',
      tokens: 32_768,
    },
  ],
  checkModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
  description:
    'Together AI 致力于通过创新的 AI 模型实现领先的性能，提供广泛的自定义能力，包括快速扩展支持和直观的部署流程，满足企业的各种需求。',
  id: 'togetherai',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://docs.together.ai/docs/chat-models',
  name: 'Together AI',
  url: 'https://www.together.ai',
};

export default TogetherAI;
