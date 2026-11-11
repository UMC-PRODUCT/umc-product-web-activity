import { useSessionStore } from '@/entities/session';

import { useFeedbackModalStore } from '../model/feedbackModalStore';
import { claimFeedbackRound, isFeedbackAnswered } from '../model/feedbackStorage';

const SHOW_DELAY_AFTER_CONFIRM_MS = 5_000;
const CONTEXT = 'APPLICATION_SUBMITTED';

export const useApplicationFeedbackTrigger = () => {
  const memberId = useSessionStore((state) => state.session.memberId);
  const show = useFeedbackModalStore((state) => state.show);
  const showAfter = useFeedbackModalStore((state) => state.showAfter);
  const waitProjectModalClose = useFeedbackModalStore((state) => state.waitProjectModalClose);
  const cancel = useFeedbackModalStore((state) => state.cancel);

  const claimRound = (roundId: number | null) =>
    memberId !== null && roundId !== null && claimFeedbackRound(CONTEXT, memberId, roundId);

  const afterSubmitConfirm = (roundId: number | null) => {
    if (claimRound(roundId)) showAfter(SHOW_DELAY_AFTER_CONFIRM_MS);
    else cancel();
  };

  const afterSubmitGoToApplications = (roundId: number | null) => {
    if (claimRound(roundId)) waitProjectModalClose();
    else cancel();
  };

  const afterProjectModalClosed = () => {
    if (!useFeedbackModalStore.getState().waitingProjectModalClose) return;
    if (memberId !== null && !isFeedbackAnswered(CONTEXT, memberId)) show();
  };

  return { afterSubmitConfirm, afterSubmitGoToApplications, afterProjectModalClosed };
};
