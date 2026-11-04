import { createFileRoute, redirect } from '@tanstack/react-router';

import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

// 서비스에 처음 들어오면(로그인 후 돌아갈 곳이 없을 때 포함) 프로젝트 목록으로
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: HOME_PATH });
  },
});
