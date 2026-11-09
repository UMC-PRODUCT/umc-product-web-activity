import { createFileRoute, redirect } from '@tanstack/react-router';

import { getProjectSettingsAccessSnapshot } from '@/entities/session';

import QuotaPage from './-quota/QuotaPage';

type QuotaSearch = { chapterId?: number };

const QuotaRoute = () => {
  const { chapterId } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <QuotaPage
      initialChapterId={chapterId}
      onChapterChange={(id) => navigate({ search: { chapterId: id }, replace: true })}
    />
  );
};

export const Route = createFileRoute('/demo-day/project-settings/quota')({
  beforeLoad: () => {
    if (getProjectSettingsAccessSnapshot() !== 'FULL') {
      throw redirect({ to: '/demo-day/team-matching/notice' });
    }
  },
  validateSearch: (search): QuotaSearch => ({
    chapterId:
      typeof search.chapterId === 'number'
        ? search.chapterId
        : typeof search.chapterId === 'string'
          ? Number(search.chapterId) || undefined
          : undefined,
  }),
  component: QuotaRoute,
});
