import type { OIDCConfig } from '@auth/core/providers';

import { authEnv } from '@/config/auth';

import { CommonProviderConfig } from './sso.config';

export type CloudflareZeroTrustProfile = {
  email: string;
  name: string;
  sub: string;
};

const provider = {
  id: 'cloudflare-zero-trust',
  provider: {
    ...CommonProviderConfig,
    authorization: { params: { scope: 'openid email profile' } },
    clientId: authEnv.CLOUDFLARE_ZERO_TRUST_CLIENT_ID,
    clientSecret: authEnv.CLOUDFLARE_ZERO_TRUST_CLIENT_SECRET,
    id: 'cloudflare-zero-trust',
    issuer: authEnv.CLOUDFLARE_ZERO_TRUST_ISSUER,
    name: 'Cloudflare Zero Trust',
    profile(profile) {
      return {
        email: profile.email,
        name: profile.name,
        providerAccountId: profile.sub,
      };
    },
    type: 'oidc',
  } satisfies OIDCConfig<CloudflareZeroTrustProfile>,
};

export default provider;
