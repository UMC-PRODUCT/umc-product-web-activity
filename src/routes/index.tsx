import { createFileRoute, redirect } from '@tanstack/react-router';

import { getRefreshToken } from '@/shared/api/authToken';
import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

// 로그인 상태면 프로젝트 목록으로, 비로그인이면 사용 가이드로
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: getRefreshToken() ? HOME_PATH : '/guide' });
  },
});
