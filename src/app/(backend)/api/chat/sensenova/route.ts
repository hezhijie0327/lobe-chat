import { getLLMConfig } from '@/config/llm';
import { AgentRuntime } from '@/libs/agent-runtime';
import { LobeSenseNovaAI } from '@/libs/agent-runtime/sensenova';

import { POST as UniverseRoute } from '../[provider]/route';

export const runtime = 'nodejs';

export const maxDuration = 30;

export const POST = async (req: Request) =>
  UniverseRoute(req, {
    createRuntime: (payload) => {
      const { SENSENOVA_ACCESS_KEY_ID, SENSENOVA_ACCESS_KEY_SECRET } = getLLMConfig();

      let sensenovaAccessKeyID: string | undefined = payload?.sensenovaAccessKeyID || SENSENOVA_ACCESS_KEY_ID;
      let sensenovaAccessKeySecret: string | undefined = payload?.sensenovaAccessKeySecret || SENSENOVA_ACCESS_KEY_SECRET;

      LobeSenseNovaAI.generateJWTToken(sensenovaAccessKeyID, sensenovaAccessKeySecret, 60, 15, (token) => {
        apiKey = token; // Set the API key in the callback
      });

      const params = {
        apiKey,
        sensenovaAccessKeyID,
        sensenovaAccessKeySecret,
      };

      const instance = new LobeSenseNovaAI(params);

      return new AgentRuntime(instance);
    },
    params: { provider: 'sensenova' },
  });
