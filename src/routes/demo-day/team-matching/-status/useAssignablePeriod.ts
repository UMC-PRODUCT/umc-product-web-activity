import { useState } from 'react';

import { useMatchingRounds } from '@/features/matching-schedule';
import type { MatchingPart } from '@/features/matching-status';

const PART_TRACK: Record<MatchingPart, 'PLAN_DESIGN' | 'PLAN_DEVELOPER'> = {
  DESIGN: 'PLAN_DESIGN',
  WEB_PE: 'PLAN_DEVELOPER',
  MOBILE_PE: 'PLAN_DEVELOPER',
};

const PART_LABEL: Record<MatchingPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web PE',
  MOBILE_PE: 'Mobile PE',
};

const isWithin = (now: number, from?: string, to?: string) =>
  !!from && !!to && new Date(from).getTime() <= now && now < new Date(to).getTime();

export const useAssignablePeriod = (chapterId: number | null) => {
  const [mountedAt] = useState(() => Date.now());
  const { data: rounds = [] } = useMatchingRounds(chapterId ?? undefined);

  const finalRounds = rounds.filter(({ phase }) => phase === 'RANDOM_MATCHING');
  const isAllPublished =
    finalRounds.length > 0 &&
    finalRounds.every(
      ({ resultPublishAt }) =>
        !!resultPublishAt && new Date(resultPublishAt).getTime() <= mountedAt,
    );

  const isPartOpen = (part: MatchingPart) => {
    const now = Date.now();
    const trackRounds = rounds.filter(({ type }) => type === PART_TRACK[part]);
    const byPhase = (phase: string) => trackRounds.find((round) => round.phase === phase);
    const first = byPhase('FIRST');
    const second = byPhase('SECOND');
    const third = byPhase('THIRD');
    const random = byPhase('RANDOM_MATCHING');

    return (
      isWithin(now, first?.startsAt, first?.decisionDeadline) ||
      isWithin(now, first?.resultPublishAt, second?.decisionDeadline) ||
      isWithin(now, second?.resultPublishAt, third?.decisionDeadline) ||
      isWithin(now, random?.startsAt, random?.endsAt)
    );
  };

  const closedMessage = (part: MatchingPart) =>
    `지금은 ${PART_LABEL[part]} 파트를 배정하거나 해제할 수 있는 기간이 아니에요.`;

  return { isPartOpen, isAllPublished, closedMessage };
};
