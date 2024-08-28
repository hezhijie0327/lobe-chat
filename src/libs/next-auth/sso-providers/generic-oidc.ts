import { OIDCConfig, OIDCUserConfig } from '@auth/core/providers';

import { authEnv } from '@/config/auth';

import { CommonProviderConfig } from './sso.config';

interface GenericOIDCProfile extends Record<string, any> {
  email: string;
  name?: string;
  sub: string;
}

function LobeGenericOIDCProvider(config: OIDCUserConfig<GenericOIDCProfile>): OIDCConfig<GenericOIDCProfile> {
  return {
    ...CommonProviderConfig,
    ...config,
    id: 'generic-oidc',
    name: 'Generic OIDC',
    profile(profile) {
      return {
        email: profile.email,
        name: profile.name ?? profile.email,
        providerAccountId: profile.sub,
      };
    },
    type: 'oidc',
  };
}

const provider = {
  id: 'generic-oidc',
  provider: LobeGenericOIDCProvider({
    authorization: { params: { scope: 'email openid profile' } }, // exclude: address, phone, offline_access
    checks: ['pkce', 'state'],
    clientId: authEnv.GENERIC_OIDC_CLIENT_ID,
    clientSecret: authEnv.GENERIC_OIDC_CLIENT_SECRET,
    issuer: authEnv.GENERIC_OIDC_ISSUER,
  }),
};

export default provider;
