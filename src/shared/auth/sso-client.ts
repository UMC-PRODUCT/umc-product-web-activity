import type { AuthClient } from '@umc-product/auth-client';
import { createAuthClient } from '@umc-product/auth-client';

import { readSsoRuntimeEnv, resolveSsoEnv } from './resolve-sso-env';

let client: AuthClient | null = null;

export const getSsoClient = () => {
  if (!client) {
    client = createAuthClient(resolveSsoEnv(window.location.origin, readSsoRuntimeEnv()), {
      onUnauthenticated: 'login',
    });
  }
  return client;
};
