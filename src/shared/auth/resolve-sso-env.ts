import type { AuthClientConfig, SsoStage } from '@umc-product/auth-client';
import { resolveAuthConfig } from '@umc-product/auth-client';

export type SsoRuntimeEnv = {
  /** localhost에서만 의미 있음. 기본 http://localhost:5174 */
  authAppUrl?: string;
  /** localhost에서만 의미 있음. 기본 auth-app */
  loginMode?: string;
};

/** 이 앱이 SSO를 허용하는 origin (scheme + host + port). */
const ACTIVITY_ORIGINS: Record<string, SsoStage> = {
  'http://localhost:5173': 'local',
  'https://dev.activity.university.neordinary.com': 'dev',
  'https://activity.university.neordinary.com': 'prod',
};

const CLIENT_ID: Record<SsoStage, string> = {
  local: 'local',
  dev: 'UMC Activity',
  prod: 'UMC Activity',
};

export const resolveSsoEnv = (origin: string, runtime: SsoRuntimeEnv = {}): AuthClientConfig =>
  resolveAuthConfig({
    clientIds: CLIENT_ID,
    local: runtime,
    origin,
    origins: ACTIVITY_ORIGINS,
  });

export const readSsoRuntimeEnv = (): SsoRuntimeEnv => ({
  authAppUrl: import.meta.env.VITE_AUTH_APP_URL,
  loginMode: import.meta.env.VITE_SSO_LOGIN_MODE,
});
