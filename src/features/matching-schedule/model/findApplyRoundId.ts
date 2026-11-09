import { toId } from '@/shared/api/toId';

import type { MatchingRoundsResponse } from '../api/getMatchingRounds';

type Track = 'DESIGN' | 'PE';
type Round = 1 | 2 | 3;

// 화면의 트랙 · 차수 → 서버 매칭 차수 type · phase (서버는 PE를 DEVELOPER로 부름)
const TYPE = { DESIGN: 'PLAN_DESIGN', PE: 'PLAN_DEVELOPER' } as const;
const PHASE = { 1: 'FIRST', 2: 'SECOND', 3: 'THIRD' } as const;

// 지원서를 만들 때 쓰는 매칭 차수 ID. 해당 트랙 · 차수의 매칭 차수가 없으면 null
export const findApplyRoundId = (rounds: MatchingRoundsResponse, track: Track, round: Round) =>
  toId(rounds.find(({ type, phase }) => type === TYPE[track] && phase === PHASE[round])?.id);
