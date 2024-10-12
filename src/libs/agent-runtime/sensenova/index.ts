import OpenAI from 'openai';

import { ChatStreamPayload, ModelProvider } from '../types';
import { LobeOpenAICompatibleFactory } from '../utils/openaiCompatibleFactory';

// Helper function for base64 URL encoding
const base64UrlEncode = (obj: object) => {
  const json = JSON.stringify(obj);
  const base64 = Buffer.from(json).toString('base64');
  return base64
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Function to generate JWT token with a callback
const generateJwtTokenSenseNova = (accessKeyID: string, accessKeySecret: string, expiredAfter: number = 1800, notBefore: number = 5, callback: (token: string) => void) => {
  const headers = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    exp: Math.floor(Date.now() / 1000) + expiredAfter,
    iss: accessKeyID,
    nbf: Math.floor(Date.now() / 1000) - notBefore,
  };

  const data = `${base64UrlEncode(headers)}.${base64UrlEncode(payload)}`;

  // Convert the secret key to a CryptoKey object
  const enc = new TextEncoder();
  globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(accessKeySecret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  ).then((key) => {
    return globalThis.crypto.subtle.sign('HMAC', key, enc.encode(data));
  }).then((signatureArrayBuffer) => {
    const signature = Buffer.from(signatureArrayBuffer).toString('base64url');
    const apiKey = `${data}.${signature}`;
    callback(apiKey); // Call the callback with the token
  });
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
      return generateJwtTokenSenseNova(ak, sk, expiredAfter, notBefore);
    },
  });
})();
