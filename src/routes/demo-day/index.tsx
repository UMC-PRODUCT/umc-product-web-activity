import { createFileRoute, redirect } from '@tanstack/react-router';

import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

// 헤더 '데모데이 매칭'(/demo-day)을 누르면 프로젝트 목록으로
export const Route = createFileRoute('/demo-day/')({
  beforeLoad: () => {
    throw redirect({ to: HOME_PATH });
  },
});
