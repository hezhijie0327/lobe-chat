import { ModelProviderCard } from '@/types/llm';

const AntGroup: ModelProviderCard = {
  chatModels: [
    {
      description: '基于万亿级Token语料训练而成，已发布的模型包含Bailing-Lite和Bailing-Pro版本。',
      displayName: 'Bailing Lite 1116',
      id: 'Bailing-Lite-1116',
      pricing: {
        input: 0,
        output: 0,
      },
      tokens: 32_768,
    },
    {
      description: '基于万亿级Token语料训练而成，已发布的模型包含Bailing-Lite和Bailing-Pro版本。',
      displayName: 'Bailing Pro 1120',
      enabled: true,
      id: 'Bailing-Pro-1120',
      pricing: {
        input: 0,
        output: 0,
      },
      tokens: 32_768,
    },
  ],
  checkModel: 'Bailing-Lite-1116',
  description:
    '百灵语言大模型是通用语言大模型，已通过生成式人工智能上线备案',
  id: 'antgroup',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://www.yuque.com/em8gt4/ymb7rf/gvif12pldt52oa6p',
  name: 'AntGroup',
  url: 'https://zxb.alipay.com/llm/landing',
};

export default AntGroup;
