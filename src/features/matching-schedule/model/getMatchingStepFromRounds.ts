import type { components } from '@/types/api';

import type { MatchingStep } from './getCurrentMatchingStep';

type MatchingRoundResponse = components['schemas']['ProjectMatchingRoundResponse'];

const PHASE_ORDER: Array<NonNullable<MatchingRoundResponse['phase']>> = [
  'FIRST',
  'SECOND',
  'THIRD',
  'RANDOM_MATCHING',
];

// 서버 타임스탬프(startsAt/endsAt)를 직접 비교해 현재 단계를 반환
// - 각 차수의 startsAt~endsAt = 지원 기간
// - 차수 간 공백(endsAt ~ 다음 startsAt) = 매칭 기간
// - RANDOM_MATCHING 기간 = 매칭 기간(round 3)
// - 모든 차수 종료 후 = ENDED
export const getMatchingStepFromRounds = (
  rounds: MatchingRoundResponse[],
  now: Date,
): MatchingStep | null => {
  if (rounds.length === 0) return null;

  const sorted = [...rounds].sort(
    (a, b) =>
      PHASE_ORDER.indexOf(a.phase as (typeof PHASE_ORDER)[number]) -
      PHASE_ORDER.indexOf(b.phase as (typeof PHASE_ORDER)[number]),
  );

  const firstStart = sorted[0].startsAt ? new Date(sorted[0].startsAt) : null;
  if (!firstStart) return null;
  if (now < firstStart) return { status: 'BEFORE_START' };

  const randomRound = sorted.find((r) => r.phase === 'RANDOM_MATCHING');
  const randomEnd = randomRound?.endsAt ? new Date(randomRound.endsAt) : null;
  if (randomEnd && now > randomEnd) return { status: 'ENDED' };

  const regularRounds = sorted.filter((r) => r.phase !== 'RANDOM_MATCHING');

  for (let i = 0; i < regularRounds.length; i++) {
    const round = regularRounds[i];
    const nextRound = i < regularRounds.length - 1 ? regularRounds[i + 1] : randomRound;
    const roundNumber = (i + 1) as 1 | 2 | 3;

    const start = round.startsAt ? new Date(round.startsAt) : null;
    const end = round.endsAt ? new Date(round.endsAt) : null;
    const nextStart = nextRound?.startsAt ? new Date(nextRound.startsAt) : null;

    if (!start || !end) continue;

    if (now >= start && now <= end) {
      return { status: 'ONGOING', phase: 'APPLY', round: roundNumber };
    }

    if (now > end && (!nextStart || now < nextStart)) {
      return { status: 'ONGOING', phase: 'MATCHING', round: roundNumber };
    }
  }

  // RANDOM_MATCHING startsAt 이후 endsAt 이전 (상단 ENDED 체크로 endsAt 이후는 이미 처리됨)
  return { status: 'ONGOING', phase: 'MATCHING', round: 3 };
};
