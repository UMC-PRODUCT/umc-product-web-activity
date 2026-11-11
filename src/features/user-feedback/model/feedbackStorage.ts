import type { FeedbackContext } from '../api/userFeedback';

type FeedbackRecord = {
  answered: boolean;
  triggeredRoundIds: number[];
};

const EMPTY_RECORD: FeedbackRecord = { answered: false, triggeredRoundIds: [] };

const STORAGE_PREFIX: Record<FeedbackContext, string> = {
  APPLICATION_SUBMITTED: 'application-feedback',
  MATCHING_COMPLETED: 'matching-feedback',
  APPLICATION_MONITORING: 'monitoring-feedback',
};

const storageKey = (context: FeedbackContext, memberId: number) =>
  `umc-activity:${STORAGE_PREFIX[context]}:${memberId}`;

const readFeedbackRecord = (context: FeedbackContext, memberId: number): FeedbackRecord => {
  try {
    const raw = localStorage.getItem(storageKey(context, memberId));
    if (!raw) return EMPTY_RECORD;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_RECORD;
    const { answered, triggeredRoundIds } = parsed as Partial<
      Record<keyof FeedbackRecord, unknown>
    >;
    return {
      answered: answered === true,
      triggeredRoundIds: Array.isArray(triggeredRoundIds)
        ? triggeredRoundIds.filter((id): id is number => typeof id === 'number')
        : [],
    };
  } catch {
    return EMPTY_RECORD;
  }
};

const writeFeedbackRecord = (
  context: FeedbackContext,
  memberId: number,
  record: FeedbackRecord,
) => {
  try {
    localStorage.setItem(storageKey(context, memberId), JSON.stringify(record));
  } catch {
    return;
  }
};

export const isFeedbackAnswered = (context: FeedbackContext, memberId: number) =>
  readFeedbackRecord(context, memberId).answered;

export const markFeedbackAnswered = (context: FeedbackContext, memberId: number) =>
  writeFeedbackRecord(context, memberId, {
    ...readFeedbackRecord(context, memberId),
    answered: true,
  });

export const claimFeedbackRound = (context: FeedbackContext, memberId: number, roundId: number) => {
  const record = readFeedbackRecord(context, memberId);
  if (record.answered || record.triggeredRoundIds.includes(roundId)) return false;
  writeFeedbackRecord(context, memberId, {
    ...record,
    triggeredRoundIds: [...record.triggeredRoundIds, roundId],
  });
  return true;
};
