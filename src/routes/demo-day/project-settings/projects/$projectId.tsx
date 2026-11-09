import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import type { ProjectStatus } from '@/features/project-management';

import ProjectRegisterPage from '../-register/ProjectRegisterPage';

const PROJECT_STATUSES: ProjectStatus[] = ['DRAFT', 'PENDING', 'APPROVED'];

const ProjectEditRoute = () => {
  const navigate = Route.useNavigate();
  const { projectId } = Route.useParams();
  const { status } = Route.useSearch();
  const queryClient = useQueryClient();

  return (
    <ProjectRegisterPage
      projectId={Number(projectId)}
      status={status}
      onComplete={() => {
        queryClient.invalidateQueries({ queryKey: ['managed-projects'] });
        navigate({ to: '/demo-day/project-settings/projects' });
      }}
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/projects/$projectId')({
  validateSearch: (search: Record<string, unknown>): { status?: ProjectStatus } => ({
    status: PROJECT_STATUSES.find((status) => status === search.status),
  }),
  component: ProjectEditRoute,
});
