import OpenAI, { ClientOptions } from 'openai';
import { LobeRuntimeAI } from '../BaseAI';
import { AgentRuntimeErrorType } from '../error';
import { ChatCompetitionOptions, ChatStreamPayload, ModelProvider } from '../types';
import { AgentRuntimeError } from '../utils/createError';
import { debugStream } from '../utils/debugStream';
import { desensitizeUrl } from '../utils/desensitizeUrl';
import { handleOpenAIError } from '../utils/handleOpenAIError';
import { convertOpenAIMessages } from '../utils/openaiHelpers';
import { StreamingResponse } from '../utils/response';
import { OpenAIStream } from '../utils/streams';
//import { generateApiToken } from './authToken';

const DEFAULT_BASE_URL = 'https://api.sensenova.cn/compatible-mode/v1';

export class LobeSenseNovaAI implements LobeRuntimeAI {
  private client: OpenAI;
  baseURL: string;
  constructor(oai: OpenAI) {
    this.client = oai;
    this.baseURL = this.client.baseURL;
  }
  /*
  static async fromAPIKey({ apiKey, baseURL = DEFAULT_BASE_URL, ...res }: ClientOptions = {}) {
    const invalidSenseNovaAPIKey = AgentRuntimeError.createError(
      AgentRuntimeErrorType.InvalidProviderAPIKey,
    );
    if (!apiKey) throw invalidSenseNovaAPIKey;
    let token: string;
    try {
      token = await generateApiToken(apiKey);
    } catch {
      throw invalidSenseNovaAPIKey;
    }
    const header = { Authorization: `Bearer ${token}` };
    const llm = new OpenAI({ apiKey, baseURL, defaultHeaders: header, ...res });
    return new LobeSenseNovaAI(llm);
  }
  */
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
      return StreamingResponse(OpenAIStream(prod, options?.callback), {
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
    const { messages, temperature, top_p, ...params } = payload;
    return {
      messages: await convertOpenAIMessages(messages as any),
      ...params,
      do_sample: temperature === 0,
      stream: true,
      // 当前的模型侧不支持 top_p=1 和 temperature 为 0
      // refs: https://SenseNova-ai.feishu.cn/wiki/TUo0w2LT7iswnckmfSEcqTD0ncd
      temperature: temperature === 0 ? undefined : temperature,
      top_p: top_p === 1 ? 0.99 : top_p,
    };
  }
}
export default LobeSenseNovaAI;
