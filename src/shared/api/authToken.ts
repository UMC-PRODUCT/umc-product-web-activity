import { getSsoClient } from '@/shared/auth/sso-client';

/** SSO 메모리 access token. 없으면 null. */
export const getAccessToken = () => {
  try {
    return getSsoClient().getAccessToken();
  } catch {
    return null;
  }
};

/** 이 앱의 SSO 세션(access/refresh)만 지운다. 글로벌 SSO 쿠키는 유지. */
export const clearAuthTokens = () => {
  try {
    getSsoClient().clearSession();
  } catch {
    // 등록되지 않은 origin 등에서는 무시
  }
};
