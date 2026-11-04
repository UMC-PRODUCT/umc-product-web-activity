import { useChapters } from '@/entities/chapter';
import { getChapterScope, useSessionStore } from '@/entities/session';

// 공지는 지부 ID를 문자열로 다뤄서(주소 · 공지 저장소 키) 서버 지부 ID를 문자열로 바꿔 줌
export type ChapterOption = { id: string; name: string };

// 권한에 따라 고를 수 있는 서버 지부 (마스터 · 중앙운영진은 전 지부, 그 외는 소속 지부)
// 기수를 모르면 지부를 부르지 않으므로 빈 목록으로 불러온 것으로 봄
export const useVisibleChapters = () => {
  const { role, gisuId, serverChapterId } = useSessionStore((state) => state.session);
  const { data: allChapters = [], isSuccess } = useChapters(gisuId);
  const visible =
    getChapterScope(role) === 'ALL'
      ? allChapters
      : allChapters.filter(({ id }) => id === serverChapterId);

  return {
    chapters: visible.map(({ id, name }): ChapterOption => ({ id: String(id), name })),
    isLoaded: isSuccess || gisuId === null,
  };
};
