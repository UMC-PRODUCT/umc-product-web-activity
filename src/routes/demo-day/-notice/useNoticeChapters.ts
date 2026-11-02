import { useChapters } from '@/entities/chapter';
import {
  canManageNotice,
  getChapterScope,
  useApplicationsView,
  useSessionStore,
} from '@/entities/session';
import { toId } from '@/shared/api/toId';

// 공지 화면의 서버 지부. 지부장 이하는 소속 지부만 보이고, 총괄단 이상은 전 지부가 보인다.
// 주소로 받은 지부가 보이는 지부면 그 지부, 아니면 소속 지부, 그것도 없으면 첫 지부
export const useNoticeChapters = (requestedChapter?: string) => {
  const { role, gisuId, serverChapterId } = useSessionStore((state) => state.session);
  const { data: allChapters = [], isSuccess: chaptersLoaded } = useChapters(gisuId);
  const isAdminView = useApplicationsView() === 'ADMIN';

  const chapters =
    getChapterScope(role) === 'ALL'
      ? allChapters
      : allChapters.filter(({ id }) => id === serverChapterId);
  const requestedId = toId(requestedChapter);
  const chapterId =
    chapters.find(({ id }) => id === requestedId)?.id ??
    chapters.find(({ id }) => id === serverChapterId)?.id ??
    chapters[0]?.id ??
    null;
  const canManage =
    isAdminView &&
    chapterId !== null &&
    canManageNotice(
      role,
      serverChapterId === null ? null : String(serverChapterId),
      String(chapterId),
    );

  return { gisuId, chapters, chaptersLoaded, chapterId, canManage };
};
