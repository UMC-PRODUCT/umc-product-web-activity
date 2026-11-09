import { createFileRoute } from '@tanstack/react-router';

import { useApplicationsView } from '@/entities/session';
import FixedWidthPage from '@/shared/ui/FixedWidthPage';

import AdminApplications from './-applications/AdminApplications';
import ChallengerApplications from './-applications/ChallengerApplications';
import PmApplications from './-applications/PmApplications';

type ApplicationsSearch = { chapterId?: number };

// 지원 현황: 주소는 하나, 권한(뷰)에 따라 화면만 다르게
const ApplicationsPage = () => {
  const view = useApplicationsView();
  const { chapterId } = Route.useSearch();
  return (
    <FixedWidthPage>
      {view === 'ADMIN' && <AdminApplications initialChapterId={chapterId} />}
      {view === 'PM_CHALLENGER' && <PmApplications />}
      {view === 'CHALLENGER' && <ChallengerApplications />}
    </FixedWidthPage>
  );
};

export const Route = createFileRoute('/demo-day/team-matching/applications')({
  validateSearch: (search): ApplicationsSearch => ({
    chapterId:
      typeof search.chapterId === 'number'
        ? search.chapterId
        : typeof search.chapterId === 'string'
          ? Number(search.chapterId) || undefined
          : undefined,
  }),
  component: ApplicationsPage,
});
