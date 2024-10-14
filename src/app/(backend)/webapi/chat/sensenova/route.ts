import { getLLMConfig } from '@/config/llm';
import { AgentRuntime } from '@/libs/agent-runtime';

import { POST as UniverseRoute } from '../[provider]/route';

export const runtime = 'nodejs';

export const maxDuration = 30;

export const POST = async (req: Request) =>
  UniverseRoute(req, {
    createRuntime: (payload) => {
      const { SENSENOVA_ACCESS_KEY_ID, SENSENOVA_ACCESS_KEY_SECRET } = getLLMConfig();

      let sensenovaAccessKeyID: string | undefined = payload?.sensenovaAccessKeyID || SENSENOVA_ACCESS_KEY_ID;
      let sensenovaAccessKeySecret: string | undefined = payload?.sensenovaAccessKeySecret || SENSENOVA_ACCESS_KEY_SECRET;

      const apiKey = (sensenovaAccessKeyID || '') + ':' + (sensenovaAccessKeySecret || '');

      const params = { apiKey };

      const instance = new LobeSenseNovaAI(params);

      return new AgentRuntime(instance);
    },
    params: { provider: 'sensenova' },
  });
