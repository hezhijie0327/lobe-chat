import { ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

import { GiteeAIStream } from '../utils/streams';

export const LobeGiteeAI = LobeOpenAICompatibleFactory({
  baseURL: 'https://ai.gitee.com/v1',
  chatCompletion: {
    handleStream: GiteeAIStream,
  },
  debug: {
    chatCompletion: () => process.env.DEBUG_GITEE_AI_CHAT_COMPLETION === '1',
  },
  provider: ModelProvider.GiteeAI,
});
