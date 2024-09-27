import { SignJWT } from 'jose';

import { getLLMConfig } from '@/config/llm';

// https://console.sensecore.cn/help/docs/model-as-a-service/nova/overview/Authorization
const encodeJwtTokenSenseCore = async (ak?: string, sk?: string): Promise<string> => {
    const secret = new TextEncoder().encode(sk);
    const jwt = await new SignJWT({
            iss: ak,
        })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(1800)
        .setNotBefore(-5)
        .sign(secret);

    return jwt;
};

export const sensecoreApiKey = async (): Promise<string> => {
    const { SENSECORE_ACCESS_KEY_ID, SENSECORE_ACCESS_KEY_SECRET } = getLLMConfig();

    const sensecoreAccessKeyID = payload?.sensecoreAccessKeyID || SENSECORE_ACCESS_KEY_ID;
    const sensecoreAccessKeySecret = payload?.sensecoreAccessKeySecret || SENSECORE_ACCESS_KEY_SECRET;

    if (!sensecoreAccessKeyID || !sensecoreAccessKeySecret) {
        throw new Error('Missing SenseCore access key ID or secret.');
    }

    // Generate the JWT token using the access key ID and secret
    const jwtToken = await encodeJwtTokenSenseCore(sensecoreAccessKeyID, sensecoreAccessKeySecret);

    return jwtToken;
};
