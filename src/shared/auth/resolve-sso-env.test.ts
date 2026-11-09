import { UnregisteredOriginError } from '@umc-product/auth-client';
import { describe, expect, it } from 'vitest';

import { resolveSsoEnv } from './resolve-sso-env';

describe('resolveSsoEnv', () => {
  it('uses the local client and auth-app mode on localhost', () => {
    expect(resolveSsoEnv('http://localhost:5173')).toEqual({
      apiBaseUrl: '',
      authAppUrl: 'http://localhost:5174',
      clientId: 'local',
      loginMode: 'auth-app',
    });
  });

  it('applies local runtime overrides only on localhost', () => {
    expect(
      resolveSsoEnv('http://localhost:5173', {
        authAppUrl: 'http://localhost:5199',
        loginMode: 'direct',
      }),
    ).toMatchObject({
      authAppUrl: 'http://localhost:5199',
      clientId: 'local',
      loginMode: 'direct',
    });
  });

  it('uses the activity client on dev and prod origins', () => {
    expect(resolveSsoEnv('https://dev.activity.university.neordinary.com')).toMatchObject({
      apiBaseUrl: 'https://api-dev.university.neordinary.com',
      clientId: 'activity',
      loginMode: 'auth-app',
    });
    expect(
      resolveSsoEnv('https://activity.university.neordinary.com', {
        loginMode: 'direct',
      }),
    ).toMatchObject({
      apiBaseUrl: 'https://api.university.neordinary.com',
      clientId: 'activity',
      loginMode: 'auth-app',
    });
  });

  it('rejects an origin that is not in the activity table', () => {
    expect(() => resolveSsoEnv('https://evil.example')).toThrow(UnregisteredOriginError);
  });
});
