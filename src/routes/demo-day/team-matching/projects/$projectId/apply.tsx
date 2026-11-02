import { createFileRoute } from '@tanstack/react-router';

import ApplyPage from '../../-apply/ApplyPage';

// 프로젝트 목록(projects.tsx)의 <Outlet />에 지원서 시트가 겹쳐서 뜸
const ApplyRoute = () => {
  const { projectId } = Route.useParams();
  return <ApplyPage projectId={Number(projectId)} />;
};

export const Route = createFileRoute('/demo-day/team-matching/projects/$projectId/apply')({
  component: ApplyRoute,
});
