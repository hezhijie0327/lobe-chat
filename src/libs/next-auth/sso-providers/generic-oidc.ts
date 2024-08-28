import { OIDCConfig, OIDCUserConfig } from '@auth/core/providers';

import { authEnv } from '@/config/auth';

import { CommonProviderConfig } from './sso.config';

interface GenericOIDCProfile extends Record<string, any> {
  email: string;
  id: string;
  name?: string;
  picture?: string;
  sub: string;
  username?: string;
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
        id: profile.sub,
        image: profile.picture ? profile.picture : undefined,
        name: profile.name ?? profile.username ?? profile.email,
        providerAccountId: profile.sub,
      };
    },
    type: 'oidc',
  };
}

const provider = {
  id: 'generic-oidc',
  provider: LobeGenericOIDCProvider({
    authorization: { params: { scope: 'email offline_access openid profile' } }, // exclude: address, phone
    checks: ['pkce', 'state'],
    clientId: authEnv.GENERIC_OIDC_CLIENT_ID,
    clientSecret: authEnv.GENERIC_OIDC_CLIENT_SECRET,
    issuer: authEnv.GENERIC_OIDC_ISSUER,
  }),
};

export default provider;
