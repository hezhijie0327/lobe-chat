import { SignJWT } from 'jose'; // Ensure you're using SignJWT
import OpenAI from 'openai';
import { ChatStreamPayload, ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

const generateJwtTokenSenseNova = async (
  accessKeyID: string,
  accessKeySecret: string,
  expiredAfter: number = 1800,
  notBefore: number = 5,
  callback: (token: string) => void
) => {
  try {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const payload = {
      exp: Math.floor(Date.now() / 1000) + expiredAfter,
      iss: accessKeyID,
      nbf: Math.floor(Date.now() / 1000) - notBefore,
    };

    // Log payload and header to verify their structure
    console.log('JWT Payload:', payload);
    console.log('JWT Header:', header);

    // Create a secret key from the accessKeySecret
    const secret = new TextEncoder().encode(accessKeySecret);

    // Log the encoded secret for debugging
    console.log('Encoded Secret:', secret);

    // Sign the JWT using SignJWT
    const token = await new SignJWT(payload)
      .setProtectedHeader(header)
      .sign(secret);

    // Log the generated token
    console.log('Generated JWT Token:', token);

    // Pass the token to the callback
    callback(token);
  } catch (error) {
    console.error('Error generating JWT token:', error);
    callback('');
  }
};

// LobeSenseNovaAI setup
export const LobeSenseNovaAI = (() => {
  // Create the factory instance using LobeOpenAICompatibleFactory
  const factory = LobeOpenAICompatibleFactory({
    baseURL: 'https://api.sensenova.cn/compatible-mode/v1',
    chatCompletion: {
      handlePayload: (payload: ChatStreamPayload) => {
        const { frequency_penalty, temperature, top_p, ...rest } = payload;

        return {
          ...rest,
          frequency_penalty: (frequency_penalty !== undefined && frequency_penalty > 0 && frequency_penalty <= 2) ? frequency_penalty : undefined,
          temperature: (temperature !== undefined && temperature > 0 && temperature <= 2) ? temperature : undefined,
          top_p: (top_p !== undefined && top_p > 0 && top_p < 1) ? top_p : undefined,
        } as OpenAI.ChatCompletionCreateParamsStreaming;
      },
    },
    debug: {
      chatCompletion: () => process.env.DEBUG_SENSENOVA_CHAT_COMPLETION === '1',
    },
    provider: ModelProvider.SenseNova,
  });

  // Use Object.assign to add the generateJWTToken method
  return Object.assign(factory, {
    generateJWTToken: (ak: string, sk: string, expiredAfter: number = 1800, notBefore: number = 5, callback: (token: string) => void) => {
      generateJwtTokenSenseNova(ak, sk, expiredAfter, notBefore, callback);
    },
  });
})();
