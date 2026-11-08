import { useQuery } from '@tanstack/react-query';

import {
  type MemberSearchQuery,
  type MemberSearchResponse,
  searchChallengers,
  searchMembers,
} from '../api/searchPmCandidates';
import { toPmCandidates } from '../lib/toPmCandidates';

// 후보 목록을 전부 받아 입력창에서 거름. 마스터는 전 지부 PM이라 한 페이지(200명)를 넘을 수 있어 페이지를 이어서 받음
const PM_CANDIDATE_SIZE = 200;
const MAX_PAGES = 10;

type UsePmCandidatesParams = {
  gisuId: number | null;
  chapterId: number | null; // 지부장은 본인 지부 PM만, 그 외 운영진은 null(전체)
  enabled: boolean; // 운영진만 PM을 고름
  useChallengerSearch?: boolean; // 마스터는 챌린저 기록이 없어 회원 검색이 막히므로 챌린저 검색을 씀
};

// 챌린저 검색 결과 → 회원 검색 결과 모양 (PM 후보 변환을 같이 씀)
const searchChallengersAsMembers = async (
  query: MemberSearchQuery,
): Promise<MemberSearchResponse> => {
  const { totalCount, page } = await searchChallengers(query);
  return {
    totalCount,
    page: {
      ...page,
      content: (page?.content ?? []).map(
        ({ challengerStatus, challengerId, gisuId, generation, part, ...member }) => ({
          ...member,
          currentChallenger: { challengerId, gisuId, generation, part, challengerStatus },
        }),
      ),
    },
  };
};

const searchAllPmCandidates = async (
  query: MemberSearchQuery,
  search: (query: MemberSearchQuery) => Promise<MemberSearchResponse>,
) => {
  const first = await search({ ...query, page: 0 });
  const content = [...(first.page?.content ?? [])];
  let hasNext = first.page?.hasNext ?? false;

  for (let page = 1; hasNext && page < MAX_PAGES; page += 1) {
    const next = await search({ ...query, page });
    content.push(...(next.page?.content ?? []));
    hasNext = next.page?.hasNext ?? false;
  }

  return { ...first, page: { ...first.page, content } };
};

export const usePmCandidates = ({
  gisuId,
  chapterId,
  enabled,
  useChallengerSearch = false,
}: UsePmCandidatesParams) =>
  useQuery({
    queryKey: ['pm-candidates', gisuId, chapterId, useChallengerSearch],
    queryFn: () =>
      searchAllPmCandidates(
        {
          gisuId: gisuId as number,
          part: 'PLAN',
          chapterId: chapterId ?? undefined,
          size: PM_CANDIDATE_SIZE,
        },
        useChallengerSearch ? searchChallengersAsMembers : searchMembers,
      ),
    enabled: enabled && gisuId !== null,
    select: toPmCandidates,
  });
