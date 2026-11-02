import { createFileRoute, Navigate } from '@tanstack/react-router';

import { NoticeWritePage } from '../../-notice';
import { useNoticeChapters } from '../../-notice/useNoticeChapters';

type NoticeWriteSearch = { chapter?: string };

const TeamMatchingNoticeWriteRoute = () => {
  const { chapter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { chaptersLoaded, canManage } = useNoticeChapters(chapter);

  // 지부 목록을 불러온 뒤에도 공지를 관리할 수 없는 사용자는 목록으로 돌려보낸다
  if (chaptersLoaded && !canManage) {
    return <Navigate to="/demo-day/team-matching/notice" replace />;
  }

  return (
    <NoticeWritePage
      kind="TEAM_MATCHING"
      chapter={chapter}
      onComplete={(completedChapterId) =>
        navigate({
          to: '/demo-day/team-matching/notice',
          search: { chapter: completedChapterId },
        })
      }
    />
  );
};

export const Route = createFileRoute('/demo-day/team-matching/notice/new')({
  validateSearch: (search): NoticeWriteSearch => ({
    chapter: typeof search.chapter === 'string' ? search.chapter : undefined,
  }),
  component: TeamMatchingNoticeWriteRoute,
});
