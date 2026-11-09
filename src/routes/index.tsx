import { createFileRoute, redirect } from '@tanstack/react-router';

import { getAccessToken } from '@/shared/api/authToken';
import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

// 로그인 상태면 프로젝트 목록으로, 비로그인이면 사용 가이드로
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: getAccessToken() ? HOME_PATH : '/guide' });
  },
});
