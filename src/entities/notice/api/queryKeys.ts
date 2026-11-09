import type { NoticeKind } from '../model/types';

// 공지 쿼리 키. 공지를 쓰거나 고치면 'notices' 아래를 다시 불러옴
export const noticeKeys = {
  all: ['notices'] as const,
  list: (kind: NoticeKind, gisuId: number | null, chapterId: number | null) =>
    ['notices', 'list', kind, gisuId, chapterId] as const,
};
