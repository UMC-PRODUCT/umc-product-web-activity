import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['MEMBER-202'];
type ChallengerOperation = operations['CHALLENGER-201'];

export type MemberSearchQuery = NonNullable<Operation['parameters']['query']>;
export type MemberSearchResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;
export type ChallengerSearchResponse = NonNullable<
  ChallengerOperation['responses'][200]['content']['*/*']
>;

/** 회원 검색 (PM 후보는 PLAN 파트로 거름). 챌린저 기록이 없는 회원이 부르면 MEMBER-0014 */
export const searchMembers = (query: MemberSearchQuery) =>
  api.get<MemberSearchResponse>('/api/v2/member/search', query);

/** 챌린저 검색. 마스터(SUPER_ADMIN)는 챌린저 기록이 없어도 쓸 수 있음 */
export const searchChallengers = (query: MemberSearchQuery) =>
  api.get<ChallengerSearchResponse>('/api/v2/challenger/search', query);
