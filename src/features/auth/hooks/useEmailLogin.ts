import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { setAuthTokens } from '@/shared/api/authToken';
import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

import { loginWithEmail } from '../api/loginWithEmail';
type EmailLoginInput = { email: string; password: string };

// 받은 토큰을 저장하고 프로젝트 목록으로 이동
export const useEmailLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: EmailLoginInput) => loginWithEmail({ email, password }),
    onSuccess: async ({ accessToken, refreshToken }) => {
      if (!accessToken) throw new Error('토큰을 받지 못했어요. 다시 로그인해 주세요.');
      setAuthTokens({ accessToken, refreshToken });
      // 이전 계정으로 불러온 데이터(내 정보 · 권한 등)가 남지 않도록 비움
      queryClient.clear();
      await navigate({ to: HOME_PATH, replace: true });
    },
  });
};
