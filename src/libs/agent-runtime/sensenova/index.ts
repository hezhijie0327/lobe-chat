import OpenAI, { ClientOptions } from 'openai';
import { SignJWT } from 'jose'; 

import { LobeRuntimeAI } from '../BaseAI';
import { AgentRuntimeErrorType } from '../error';
import { ChatCompetitionOptions, ChatStreamPayload, ModelProvider, ChatStreamCallbacks, OpenAIChatMessage } from '../types';
import { AgentRuntimeError } from '../utils/createError';
import { debugStream } from '../utils/debugStream';
import { desensitizeUrl } from '../utils/desensitizeUrl';
import { handleOpenAIError } from '../utils/handleOpenAIError';
import { convertOpenAIMessages } from '../utils/openaiHelpers';
import { StreamingResponse } from '../utils/response';
import { OpenAIStream, OpenAIStreamOptions } from '../utils/streams';

// https://console.sensecore.cn/help/docs/model-as-a-service/nova/overview/Authorization
const generateJwtTokenSenseNova = async (
  apiKey: string = '',
  expiredAfter: number = 1800,
  notBefore: number = 5
): Promise<string> => {
  const encoder = new TextEncoder();

  const [ accessKeyID, accessKeySecret ] = apiKey.split(':');

  const payload = {
    exp: Math.floor(Date.now() / 1000) + expiredAfter,
    iss: accessKeyID,
    nbf: Math.floor(Date.now() / 1000) - notBefore,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(encoder.encode(accessKeySecret));

  return jwt;
};

const DEFAULT_BASE_URL = 'https://api.sensenova.cn/compatible-mode/v1';

export class LobeSenseNovaAI implements LobeRuntimeAI {
  private client: OpenAI;
  baseURL: string;

  constructor(oai: OpenAI) {
    this.client = oai;
    this.baseURL = this.client.baseURL;
  }

  static async fromAPIKey({ apiKey, baseURL = DEFAULT_BASE_URL, ...res }: ClientOptions = {}) {
    const invalidSenseNovaAPIKey = AgentRuntimeError.createError(
      AgentRuntimeErrorType.InvalidProviderAPIKey,
    );

    if (!apiKey) throw invalidSenseNovaAPIKey;

    let token: string;

    try {
      token = await generateJwtTokenSenseNova(apiKey);
    } catch {
      throw invalidSenseNovaAPIKey;
    }

    const header = { Authorization: `Bearer ${token}` };
    const llm = new OpenAI({ apiKey, baseURL, defaultHeaders: header, ...res });

    return new LobeSenseNovaAI(llm);
  }

  async chat(payload: ChatStreamPayload, options?: ChatCompetitionOptions) {
    try {
      const params = await this.buildCompletionsParams(payload);

      const response = await this.client.chat.completions.create(
        params as unknown as OpenAI.ChatCompletionCreateParamsStreaming,
      );

      const [prod, debug] = response.tee();

      if (process.env.DEBUG_SENSENOVA_CHAT_COMPLETION === '1') {
        debugStream(debug.toReadableStream()).catch(console.error);
      }

      // Convert ChatStreamCallbacks to OpenAIStreamOptions
      const openAIStreamOptions = this.convertCallbacks(options?.callback);

      return StreamingResponse(OpenAIStream(prod, openAIStreamOptions), {
        headers: options?.headers,
      });
    } catch (error) {
      const { errorResult, RuntimeError } = handleOpenAIError(error);

      const errorType = RuntimeError || AgentRuntimeErrorType.ProviderBizError;
      let desensitizedEndpoint = this.baseURL;

      if (this.baseURL !== DEFAULT_BASE_URL) {
        desensitizedEndpoint = desensitizeUrl(this.baseURL);
      }
      throw AgentRuntimeError.chat({
        endpoint: desensitizedEndpoint,
        error: errorResult,
        errorType,
        provider: ModelProvider.SenseNova,
      });
    }
  }

  private async buildCompletionsParams(payload: ChatStreamPayload) {
    const { frequency_penalty, messages, temperature, top_p, ...params } = payload;

    return {
      messages: await convertOpenAIMessages(messages as any),
      ...params,
      stream: true,
      frequency_penalty: (frequency_penalty !== undefined && frequency_penalty > 0 && frequency_penalty <= 2) ? frequency_penalty : undefined,
      temperature: (temperature !== undefined && temperature > 0 && temperature <= 2) ? temperature : undefined,
      top_p: (top_p !== undefined && top_p > 0 && top_p < 1) ? top_p : undefined,
    };
  }
}

export default LobeSenseNovaAI;
