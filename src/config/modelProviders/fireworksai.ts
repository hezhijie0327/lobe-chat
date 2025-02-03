import { ModelProviderCard } from '@/types/llm';

// ref: https://fireworks.ai/models?show=Serverless
// ref: https://fireworks.ai/pricing
const FireworksAI: ModelProviderCard = {
  chatModels: [
    {
      contextWindowTokens: 131_072,
      description:
        'Llama 3.3 70B Instruct is the December update of Llama 3.1 70B. The model improves upon Llama 3.1 70B (released July 2024) with advances in tool calling, multilingual text support, math and coding. The model achieves industry leading results in reasoning, math and instruction following and provides similar performance as 3.1 405B but with significant speed and cost improvements.',
      displayName: 'Llama 3.3 70B Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 131_072,
      description:
        'Llama 3.2 3B instruct is a lightweight, multilingual model from Meta. The model is designed for efficiency and offers substantial latency and cost improvements compared to larger models. Example use cases for the model include query and prompt rewriting and writing assistance',
      displayName: 'Llama 3.2 3B Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p2-3b-instruct',
      pricing: {
        input: 0.1,
        output: 0.1,
      },
    },
    {
      contextWindowTokens: 131_072,
      description:
        'Instruction-tuned image reasoning model from Meta with 11B parameters. Optimized for visual recognition, image reasoning, captioning, and answering general questions about an image. The model can understand visual data, such as charts and graphs and also bridge the gap between vision and language by generating text to describe images details',
      displayName: 'Llama 3.2 11B Vision Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p2-11b-vision-instruct',
      pricing: {
        input: 0.2,
        output: 0.2,
      },
      vision: true,
    },
    {
      contextWindowTokens: 131_072,
      description:
        'Instruction-tuned image reasoning model with 90B parameters from Meta. Optimized for visual recognition, image reasoning, captioning, and answering general questions about an image. The model can understand visual data, such as charts and graphs and also bridge the gap between vision and language by generating text to describe images details Note: This mode is served experimentally as a serverless model. If you are deploying in production, be aware that Fireworks may undeploy the model with short notice.',
      displayName: 'Llama 3.2 90B Vision Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p2-90b-vision-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
      vision: true,
    },
    {
      contextWindowTokens: 131_072,
      description:
        'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes. The Llama 3.1 instruction tuned text only models (8B, 70B, 405B) are optimized for multilingual dialogue use cases and outperform many of the available open source and closed chat models on common industry benchmarks. 405B model is the most capable from the Llama 3.1 family. This model is served in FP8 closely matching reference implementation.',
      displayName: 'Llama 3.1 8B Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
      pricing: {
        input: 0.2,
        output: 0.2,
      },
    },
    {
      contextWindowTokens: 131_072,
      description:
        'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes. The Llama 3.1 instruction tuned text only models (8B, 70B, 405B) are optimized for multilingual dialogue use cases and outperform many of the available open source and closed chat models on common industry benchmarks. 405B model is the most capable from the Llama 3.1 family. This model is served in FP8 closely matching reference implementation.',
      displayName: 'Llama 3.1 70B Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 131_072,
      description:
        'The Meta Llama 3.1 collection of multilingual large language models (LLMs) is a collection of pretrained and instruction tuned generative models in 8B, 70B and 405B sizes. The Llama 3.1 instruction tuned text only models (8B, 70B, 405B) are optimized for multilingual dialogue use cases and outperform many of the available open source and closed chat models on common industry benchmarks. 405B model is the most capable from the Llama 3.1 family. This model is served in FP8 closely matching reference implementation.',
      displayName: 'Llama 3.1 405B Instruct',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/llama-v3p1-405b-instruct',
      pricing: {
        input: 3,
        output: 3,
      },
    },
    {
      contextWindowTokens: 8192,
      description:
        'Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks.',
      displayName: 'Llama 3 8B Instruct',
      id: 'accounts/fireworks/models/llama-v3-8b-instruct',
      pricing: {
        input: 0.2,
        output: 0.2,
      },
    },
    {
      contextWindowTokens: 8192,
      description:
        'Meta developed and released the Meta Llama 3 family of large language models (LLMs), a collection of pretrained and instruction tuned generative text models in 8 and 70B sizes. The Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks.',
      displayName: 'Llama 3 70B Instruct',
      id: 'accounts/fireworks/models/llama-v3-70b-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 8192,
      description:
        'Meta Llama 3 instruction tuned models are optimized for dialogue use cases and outperform many of the available open source chat models on common industry benchmarks. Llama 3 8B Instruct (HF Version) is the original, FP16 version of Llama 3 8B Instruct whose results should be consistent with the official Hugging Face implementation.',
      displayName: 'Llama 3 8B Instruct (HF version)',
      id: 'accounts/fireworks/models/llama-v3-8b-instruct-hf',
      pricing: {
        input: 0.2,
        output: 0.2,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        '24B parameters and achieving state-of-the-art capabilities comparable to larger models',
      displayName: 'Mistral Small 3 Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/mistral-small-24b-instruct-2501',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        'Mixtral MoE 8x7B Instruct is the instruction-tuned version of Mixtral MoE 8x7B and has the chat completions API enabled.',
      displayName: 'Mixtral MoE 8x7B Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/mixtral-8x7b-instruct',
      pricing: {
        input: 0.5,
        output: 0.5,
      },
    },
    {
      contextWindowTokens: 65_536,
      description:
        'Mixtral MoE 8x22B Instruct v0.1 is the instruction-tuned version of Mixtral MoE 8x22B v0.1 and has the chat completions API enabled.',
      displayName: 'Mixtral MoE 8x22B Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/mixtral-8x22b-instruct',
      pricing: {
        input: 1.2,
        output: 1.2,
      },
    },
    {
      contextWindowTokens: 32_064,
      description:
        'Phi-3-Vision-128K-Instruct is a lightweight, state-of-the-art open multimodal model built upon datasets which include - synthetic data and filtered publicly available websites - with a focus on very high-quality, reasoning dense data both on text and vision. The model belongs to the Phi-3 model family, and the multimodal version comes with 128K context length (in tokens) it can support. The model underwent a rigorous enhancement process, incorporating both supervised fine-tuning and direct preference optimization to ensure precise instruction adherence and robust safety measures.',
      displayName: 'Phi 3.5 Vision Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/phi-3-vision-128k-instruct',
      pricing: {
        input: 0.2,
        output: 0.2,
      },
      vision: true,
    },
    {
      contextWindowTokens: 32_768,
      description:
        'An improved, potentially even perfected variant of MythoMix, a MythoLogic-L2 and Huginn merge using a highly experimental tensor type merge technique. Proficient at both storytelling and roleplaying due to its unique nature.',
      displayName: 'MythoMax L2 13b',
      id: 'accounts/fireworks/models/mythomax-l2-13b',
      pricing: {
        input: 0.2,
        output: 0.2,
      },
      vision: true,
    },
    {
      contextWindowTokens: 131_072,
      description:
        'A a strong Mixture-of-Experts (MoE) language model with 671B total parameters with 37B activated for each token from Deepseek.',
      displayName: 'Deepseek V3',
      enabled: true,
      functionCall: true,
      id: 'accounts/fireworks/models/deepseek-v3',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 163_840,
      description:
        'DeepSeek-R1 is a state-of-the-art large language model optimized with reinforcement learning and cold-start data for exceptional reasoning, math, and code performance.',
      displayName: 'Deepseek R1',
      enabled: true,
      id: 'accounts/fireworks/models/deepseek-r1',
      pricing: {
        input: 8,
        output: 8,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        'Qwen QwQ model focuses on advancing AI reasoning, and showcases the power of open models to match closed frontier model performance.QwQ-32B-Preview is an experimental release, comparable to o1 and surpassing GPT-4o and Claude 3.5 Sonnet on analytical and reasoning abilities across GPQA, AIME, MATH-500 and LiveCodeBench benchmarks. Note: This model is served experimentally as a serverless model. If you are deploying in production, be aware that Fireworks may undeploy the model with short notice.',
      displayName: 'Qwen Qwq 32b Preview',
      enabled: true,
      id: 'accounts/fireworks/models/qwen-qwq-32b-preview',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        'Qwen2.5 are a series of decoder-only language models developed by Qwen team, Alibaba Cloud, available in 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B sizes, and base and instruct variants.',
      displayName: 'Qwen2.5 72B Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/qwen2p5-72b-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        'The 72B variant of the latest iteration of Qwen-VL model from Alibaba, representing nearly a year of innovation.',
      displayName: 'Qwen2 VL 72B Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/qwen2-vl-72b-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
      vision: true,
    },
    {
      contextWindowTokens: 32_768,
      description:
        'Qwen2.5-Coder is the latest series of Code-Specific Qwen large language models (formerly known as CodeQwen). Note: This model is served experimentally as a serverless model. If you are deploying in production, be aware that Fireworks may undeploy the model with short notice.',
      displayName: 'Qwen2.5-Coder-32B-Instruct',
      enabled: true,
      id: 'accounts/fireworks/models/qwen2p5-coder-32b-instruct',
      pricing: {
        input: 0.9,
        output: 0.9,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        'Yi-Large is among the top LLMs, with performance on the LMSYS benchmark leaderboard closely trailing GPT-4, Gemini 1.5 Pro, and Claude 3 Opus. It excels in multilingual capabilities, especially in Spanish, Chinese, Japanese, German, and French. Yi-Large is user-friendly, sharing the same API definition as OpenAI for easy integration.',
      displayName: 'Yi-Large',
      enabled: true,
      id: 'accounts/yi-01-ai/models/yi-large',
      pricing: {
        input: 3,
        output: 3,
      },
    },
  ],
  checkModel: 'accounts/fireworks/models/llama-v3p2-3b-instruct',
  description:
    'Fireworks AI 是一家领先的高级语言模型服务商，专注于功能调用和多模态处理。其最新模型 Firefunction V2 基于 Llama-3，优化用于函数调用、对话及指令跟随。视觉语言模型 FireLLaVA-13B 支持图像和文本混合输入。其他 notable 模型包括 Llama 系列和 Mixtral 系列，提供高效的多语言指令跟随与生成支持。',
  id: 'fireworksai',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://fireworks.ai/models?show=Serverless',
  name: 'Fireworks AI',
  settings: {
    sdkType: 'openai',
    showModelFetcher: true,
  },
  url: 'https://fireworks.ai',
};

export default FireworksAI;
