import { ModelProviderCard } from '@/types/llm';

// ref https://docs.cohere.com/v2/docs/tools
const Cohere: ModelProviderCard = {
  chatModels: [
    {
      description: 'command-r-plus is an alias for command-r-plus-04-2024, so if you use command-r-plus in the API, that’s the model you’re pointing to.',
      displayName: 'Command R+',
      enabled: true,
      functionCall: true,
      id: 'command-r-plus',
      maxOutput: 4000,
      pricing: {
        input: 2.5,
        output: 10,
      },
      tokens: 128_000,
    },
    {
      description: 'command-r-plus-08-2024 is an update of the Command R+ model, delivered in August 2024.',
      displayName: 'Command R+ 08-2024',
      functionCall: true,
      id: 'command-r-plus-08-2024',
      maxOutput: 4000,
      pricing: {
        input: 2.5,
        output: 10,
      },
      tokens: 128_000,
    },
    {
      description: 'Command R+ is an instruction-following conversational model that performs language tasks at a higher quality, more reliably, and with a longer context than previous models. It is best suited for complex RAG workflows and multi-step tool use.',
      displayName: 'Command R+ 04-2024',
      functionCall: true,
      id: 'command-r-plus-04-2024',
      maxOutput: 4000,
      pricing: {
        input: 2.5,
        output: 10,
      },
      tokens: 128_000,
    },
    {
      description: 'command-r is an alias for command-r-03-2024, so if you use command-r in the API, that’s the model you’re pointing to.',
      displayName: 'Command R',
      enabled: true,
      functionCall: true,
      id: 'command-r',
      maxOutput: 4000,
      pricing: {
        input: 0.15,
        output: 0.6,
      },
      tokens: 128_000,
    },
    {
      description: 'command-r-08-2024 is an update of the Command R model, delivered in August 2024.',
      displayName: 'Command R 08-2024',
      functionCall: true,
      id: 'command-r-08-2024',
      maxOutput: 4000,
      pricing: {
        input: 0.15,
        output: 0.6,
      },
      tokens: 128_000,
    },
    {
      description: 'Command R is an instruction-following conversational model that performs language tasks at a higher quality, more reliably, and with a longer context than previous models. It can be used for complex workflows like code generation, retrieval augmented generation (RAG), tool use, and agents.',
      displayName: 'Command R 03-2024',
      functionCall: true,
      id: 'command-r-03-2024',
      maxOutput: 4000,
      pricing: {
        input: 0.15,
        output: 0.6,
      },
      tokens: 128_000,
    },
    {
      description: 'An instruction-following conversational model that performs language tasks with high quality, more reliably and with a longer context than our base generative models.',
      displayName: 'Command',
      enabled: true,
      id: 'command',
      maxOutput: 4000,
      tokens: 4000,
    },
    {
      description: 'To reduce the time between major releases, we put out nightly versions of command models. For command, that is command-nightly. Be advised that command-nightly is the latest, most experimental, and (possibly) unstable version of its default counterpart. Nightly releases are updated regularly, without warning, and are not recommended for production use.',
      displayName: 'Command Nightly',
      id: 'command-nightly',
      maxOutput: 128_000,
      tokens: 128_000,
    },
    {
      description: 'A smaller, faster version of command. Almost as capable, but a lot faster.',
      displayName: 'Command Light',
      enabled: true,
      id: 'command-light',
      maxOutput: 4000,
      tokens: 4000,
    },
    {
      description: 'To reduce the time between major releases, we put out nightly versions of command models. For command-light, that is command-light-nightly. Be advised that command-light-nightly is the latest, most experimental, and (possibly) unstable version of its default counterpart. Nightly releases are updated regularly, without warning, and are not recommended for production use.',
      displayName: 'Command Light Nightly',
      id: 'command-light-nightly',
      maxOutput: 4000,
      tokens: 4000,
    },
    {
      description: 'Aya Expanse is a highly performant 8B multilingual model, designed to rival monolingual performance through innovations in instruction tuning with data arbitrage, preference training, and model merging. Serves 23 languages.',
      displayName: 'Aya Expanse 8b',
      enabled: true,
      id: 'c4ai-aya-expanse-8b',
      maxOutput: 4000,
      tokens: 8000,
    },
    {
      description: 'Aya Expanse is a highly performant 32B multilingual model, designed to rival monolingual performance through innovations in instruction tuning with data arbitrage, preference training, and model merging. Serves 23 languages.',
      displayName: 'Aya Expanse 32B',
      enabled: true,
      id: 'c4ai-aya-expanse-32b',
      maxOutput: 4000,
      tokens: 8000,
    },
  ],
  checkModel: 'command-light',
  id: 'cohere',
  modelList: { showModelFetcher: true },
  modelsUrl: 'https://docs.cohere.com/v2/docs/models',
  name: 'Cohere',
  url: 'https://cohere.com/pricing',
};

export default Cohere;
