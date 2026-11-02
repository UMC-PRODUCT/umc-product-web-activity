// 공지 쿼리 키. 공지를 쓰거나 고치면 'notices' 아래를 다시 불러옴
export const noticeKeys = {
  all: ['notices'] as const,
  list: (gisuId: number | null, chapterId: number | null) =>
    ['notices', 'list', gisuId, chapterId] as const,
};
