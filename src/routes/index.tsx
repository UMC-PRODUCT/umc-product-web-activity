import { createFileRoute, redirect } from '@tanstack/react-router';

import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

// 로그인 여부와 상관없이 프로젝트 목록으로 (비로그인도 볼 수 있는 화면)
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: HOME_PATH });
  },
});
