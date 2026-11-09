import { useState } from 'react';

import type { Applicant } from '@/features/application-list';
import { getMatchingStepFromRounds, useMatchingRounds } from '@/features/matching-schedule';
import { toId } from '@/shared/api/toId';

const ROUND_PHASE = { 1: 'FIRST', 2: 'SECOND', 3: 'THIRD' } as const;

export const useMatchingPeriodAccess = (chapterId: number | null) => {
  const [now] = useState(() => new Date());
  const { data: rounds = [] } = useMatchingRounds(chapterId ?? undefined);

  const currentRoundIds = new Set<number>();
  let isApplyPeriod = false;
  for (const type of ['PLAN_DESIGN', 'PLAN_DEVELOPER'] as const) {
    const trackRounds = rounds.filter((round) => round.type === type);
    const step = getMatchingStepFromRounds(trackRounds, now);
    if (step?.status !== 'ONGOING') continue;
    if (step.phase === 'APPLY') {
      isApplyPeriod = true;
      continue;
    }
    const roundId = toId(trackRounds.find(({ phase }) => phase === ROUND_PHASE[step.round])?.id);
    if (roundId !== null) currentRoundIds.add(roundId);
  }

  const publishedRoundIds = new Set(
    rounds.flatMap(({ id, resultPublishAt }) => {
      const roundId = toId(id);
      return roundId !== null && resultPublishAt && new Date(resultPublishAt) <= now
        ? [roundId]
        : [];
    }),
  );

  return {
    isModalLocked: isApplyPeriod || currentRoundIds.size === 0,
    isCurrentRound: ({ matchingRoundId }: Applicant) =>
      matchingRoundId !== null && currentRoundIds.has(matchingRoundId),
    isResultPublished: ({ matchingRoundId }: Applicant) =>
      matchingRoundId !== null && publishedRoundIds.has(matchingRoundId),
  };
};
