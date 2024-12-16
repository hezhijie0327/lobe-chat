import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

export const LobeAntGroupAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://bailingchat.alipay.com',
  debug: {
    chatCompletion: () => process.env.DEBUG_ANTGROUP_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.AntGroup,
});
