import type { Notice } from '../model/types';

// 위에서부터: 기본 필독(안내사항) → 필독 → 일반 → 기본 일반(자주 질문·문의 안내)
const groupOf = ({ hardcoded, required }: Notice): number => {
  if (hardcoded) return required ? 0 : 3;
  return required ? 1 : 2;
};

// 기본 공지는 넣은 순서를 지키고, 작성된 공지는 각 그룹 안에서 최신순으로 정렬
export const sortNotices = (notices: Notice[]): Notice[] =>
  [...notices].sort((a, b) => {
    const groupDiff = groupOf(a) - groupOf(b);
    if (groupDiff !== 0) return groupDiff;
    if (a.hardcoded) return 0;
    return b.createdAt.localeCompare(a.createdAt);
  });
