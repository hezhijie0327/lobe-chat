import { getLLMConfig } from '@/config/llm';
import { AgentRuntime } from '@/libs/agent-runtime';
import LobeSenseNovaAI from '@/libs/agent-runtime/sensenova';

import { POST as UniverseRoute } from '../[provider]/route';

export const runtime = 'nodejs';

export const maxDuration = 30;

export const POST = async (req: Request) =>
  UniverseRoute(req, {
    createRuntime: (payload) => {
      const { SENSENOVA_ACCESS_KEY_ID, SENSENOVA_ACCESS_KEY_SECRET } = getLLMConfig();
      let sensenovaAccessKeyID: string | undefined = SENSENOVA_ACCESS_KEY_ID;
      let sensenovaAccessKeySecret: string | undefined = SENSENOVA_ACCESS_KEY_SECRET;

      // if the payload has the api key, use user
      if (payload.apiKey) {
        sensenovaAccessKeyID = payload?.sensenovaAccessKeyID;
        sensenovaAccessKeySecret = payload?.sensenovaAccessKeySecret;
      }

      const params = { accessKey, secretKey };
      const instance = new LobeSenseNovaAI(params);

      return new AgentRuntime(instance);
    },
    params: { provider: 'sensenova' },
  });
