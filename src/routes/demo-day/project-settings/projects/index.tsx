import { createFileRoute } from '@tanstack/react-router';

import ProjectsPage from '../-projects/ProjectsPage';

type ProjectsSearch = { chapterId?: number };

const ProjectsRoute = () => {
  const { chapterId } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ProjectsPage
      initialChapterId={chapterId}
      onChapterChange={(id) => navigate({ search: { chapterId: id }, replace: true })}
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/projects/')({
  validateSearch: (search): ProjectsSearch => ({
    chapterId:
      typeof search.chapterId === 'number'
        ? search.chapterId
        : typeof search.chapterId === 'string'
          ? Number(search.chapterId) || undefined
          : undefined,
  }),
  component: ProjectsRoute,
});
