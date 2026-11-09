/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AUTH_APP_URL?: string;
  readonly VITE_SSO_LOGIN_MODE?: string;
  readonly VITE_DEV_API_PROXY_TARGET?: string;
  readonly VITE_QA_ACCOUNTS?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
