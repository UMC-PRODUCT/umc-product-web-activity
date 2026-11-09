import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSsoClient } from '@/shared/auth/sso-client';
import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

type EmailLoginInput = { email: string; password: string; returnTo?: string };

/** local direct 모드: QA 폼 제출 → SSO `devLogin`(이메일 로그인 후 authorize) */
export const useEmailLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, returnTo = HOME_PATH }: EmailLoginInput) =>
      getSsoClient().devLogin(email, password, returnTo),
    onSuccess: () => {
      // 이전 계정으로 불러온 데이터(내 정보 · 권한 등)가 남지 않도록 비움
      queryClient.clear();
    },
  });
};
