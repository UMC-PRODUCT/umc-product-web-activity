import { useEffect, useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { useSessionStore } from '@/entities/session';
import { useMatchingRounds } from '@/features/matching-schedule';
import { MatchingFeedbackModal } from '@/features/user-feedback';

const trimTrailingSlash = (path: string) => path.replace(/\/+$/, '');

let leftReloadedPage = false;

const isOpenedByReload = () => {
  if (leftReloadedPage) return false;
  try {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entry?.type !== 'reload') return false;
    return (
      trimTrailingSlash(new URL(entry.name).pathname) ===
      trimTrailingSlash(window.location.pathname)
    );
  } catch {
    return false;
  }
};

const MatchingFeedbackGate = () => {
  const { gisuId, serverChapterId } = useSessionStore((state) => state.session);
  const { data: chapters = [] } = useChapters(gisuId);
  const { data: rounds = [] } = useMatchingRounds(serverChapterId ?? chapters[0]?.id);
  const [mountedAt] = useState(() => Date.now());
  const [openedByReload] = useState(isOpenedByReload);

  useEffect(
    () => () => {
      leftReloadedPage = true;
    },
    [],
  );

  const isResultCheckPeriod = rounds.some(
    ({ resultPublishAt }) => !!resultPublishAt && new Date(resultPublishAt).getTime() <= mountedAt,
  );

  return <MatchingFeedbackModal active={!openedByReload && isResultCheckPeriod} />;
};

export default MatchingFeedbackGate;
