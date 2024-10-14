import { SignJWT } from 'jose';

// https://console.sensecore.cn/help/docs/model-as-a-service/nova/overview/Authorization
export const generateApiToken = async (apiKey?: string): Promise<string> => {
  console.log(apiKey);
  
  if (!apiKey) {
    throw new Error('Invalid apiKey');
  }

  const [id, secret] = apiKey.split(':');
  if (!id || !secret) {
    throw new Error('Invalid apiKey');
  }

  console.log(id, secret);
  
  const encoder = new TextEncoder();

  const payload = {
    exp: Math.floor(Date.now() / 1000) + 1800,
    iss: id,
    nbf: Math.floor(Date.now() / 1000) - 5,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(encoder.encode(secret));

  console.log(jwt);

  return jwt;
};
