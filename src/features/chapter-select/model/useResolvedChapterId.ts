import { useSessionStore } from '@/entities/session';

import { useVisibleChapters } from './useVisibleChapters';

// 주소로 받은 지부가 볼 수 있는 지부면 그 지부, 아니면 본인 지부, 그것도 없으면 첫 지부
// 지부 목록을 불러오기 전이나 고를 수 있는 지부가 없으면 null
export const useResolvedChapterId = (requestedChapterId?: string) => {
  const { chapters, isLoaded } = useVisibleChapters();
  const ownChapterId = useSessionStore((state) => state.session.serverChapterId);

  if (!isLoaded) return null;
  if (requestedChapterId && chapters.some((chapter) => chapter.id === requestedChapterId)) {
    return requestedChapterId;
  }
  return (
    chapters.find((chapter) => chapter.id === String(ownChapterId))?.id ?? chapters[0]?.id ?? null
  );
};
