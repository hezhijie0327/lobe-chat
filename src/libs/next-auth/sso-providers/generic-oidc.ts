import type { OIDCConfig } from '@auth/core/providers';

import { authEnv } from '@/config/auth';

import { CommonProviderConfig } from './sso.config';

export type GenericOIDCProfile = {
  email: string;
  name?: string;
  sub: string;
};

const provider = {
  id: 'generic-oidc',
  provider: {
    ...CommonProviderConfig,
    authorization: { params: { scope: 'email openid profile' } },
    checks: ['state', 'pkce'],
    clientId: authEnv.GENERIC_OIDC_CLIENT_ID,
    clientSecret: authEnv.GENERIC_OIDC_CLIENT_SECRET,
    id: 'generic-oidc',
    issuer: authEnv.GENERIC_OIDC_ISSUER,
    name: 'Generic OIDC',
    profile(profile) {
      return {
        email: profile.email,
        name: profile.name ?? profile.email, // use profile.email instead of profile.name if not exsit.
        providerAccountId: profile.sub,
      };
    },
    type: 'oidc',
  } satisfies OIDCConfig<GenericOIDCProfile>,
};

export default provider;
