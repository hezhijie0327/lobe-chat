import { getLLMConfig } from '@/config/llm';
import { AgentRuntime } from '@/libs/agent-runtime';
import { LobeSenseNovaAI } from '@/libs/agent-runtime/sensenova';

import { POST as UniverseRoute } from '../[provider]/route';

export const runtime = 'nodejs';

export const maxDuration = 30;

export const POST = async (req: Request) => {
  const { SENSENOVA_ACCESS_KEY_ID, SENSENOVA_ACCESS_KEY_SECRET } = getLLMConfig();

  let sensenovaAccessKeyID: string | undefined = SENSENOVA_ACCESS_KEY_ID;
  let sensenovaAccessKeySecret: string | undefined = SENSENOVA_ACCESS_KEY_SECRET;

  console.log(sensenovaAccessKeyID);
  console.log(sensenovaAccessKeySecret);
  
  const apiKey = await LobeSenseNovaAI.generateJWTToken(sensenovaAccessKeyID || '', sensenovaAccessKeySecret || '');

  console.log(apiKey);

  return UniverseRoute(req, {
    createRuntime: (payload) => {
      const params = {
        apiKey,  // 传递生成的 apiKey
        sensenovaAccessKeyID: payload?.sensenovaAccessKeyID || sensenovaAccessKeyID,
        sensenovaAccessKeySecret: payload?.sensenovaAccessKeySecret || sensenovaAccessKeySecret,
      };

      const instance = new LobeSenseNovaAI(params);

      return new AgentRuntime(instance);
    },
    params: { provider: 'sensenova' },
  });
};
