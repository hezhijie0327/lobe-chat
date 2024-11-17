import { ModelProviderCard } from '@/types/llm';

const Gitee: ModelProviderCard = {
  chatModels: [
    {
      displayName: 'Qwen2.5 72B Instruct',
      enabled: true,
      id: 'Qwen2.5-72B-Instruct'
    },
    {
      displayName: 'Qwen2 72B Instruct',
      id: 'Qwen2-72B-Instruct'
    },
    {
      displayName: 'Qwen2 7B Instruct',
      id: 'Qwen2-7B-Instruct'
    },
    {
      displayName: 'GLM4 9B Chat',
      enabled: true,
      id: 'glm-4-9b-chat'
    },
    {
      displayName: 'Yi 34B Chat',
      enabled: true,
      id: 'Yi-34B-Chat'
    },
    {
      displayName: 'DeepSeek Coder 33B Instruct',
      enabled: true,
      id: 'deepseek-coder-33B-instruct'
    },
    {
      displayName: 'CodeGeeX4 All 9B',
      enabled: true,
      id: 'codegeex4-all-9b'
    },
    {
      displayName: 'Code Raccoon v1',
      enabled: true,
      id: 'code-raccoon-v1'
    },
  ],
  checkModel: 'Qwen2-7B-Instruct',
  description:
    'Gitee AI 的 Serverless API 为 AI 开发者提供开箱即用的大模型推理 API 服务。',
  id: 'gitee',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://ai.gitee.com/docs/openapi/v1#tag/serverless/POST/chat/completions',
  name: 'Gitee',
  url: 'https://ai.gitee.com',
};

export default Gitee;
