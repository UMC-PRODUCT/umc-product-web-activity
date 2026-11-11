import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useSessionStore } from '@/entities/session';

import { getUserFeedbackTemplate } from '../api/userFeedback';
import { isFeedbackAnswered, markFeedbackAnswered } from '../model/feedbackStorage';
import FeedbackSurveyDialog from './FeedbackSurveyDialog';

const CONTEXT = 'MATCHING_COMPLETED';
const SHOW_DELAY_MS = 5_000;

type MatchingFeedbackModalProps = {
  active: boolean;
};

const MatchingFeedbackModal = ({ active }: MatchingFeedbackModalProps) => {
  const memberId = useSessionStore((state) => state.session.memberId);
  const [justAnswered, setJustAnswered] = useState(false);
  const answered = justAnswered || (memberId !== null && isFeedbackAnswered(CONTEXT, memberId));
  const [delayPassed, setDelayPassed] = useState(false);

  const shouldShow = active && memberId !== null && !answered;

  useEffect(() => {
    if (!shouldShow) return;
    const timer = setTimeout(() => setDelayPassed(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  const { data: template } = useQuery({
    queryKey: ['user-feedback-template', CONTEXT],
    queryFn: () => getUserFeedbackTemplate(CONTEXT),
    enabled: shouldShow,
    staleTime: Infinity,
  });

  if (
    memberId === null ||
    !shouldShow ||
    !delayPassed ||
    !template ||
    template.templateId === undefined
  )
    return null;

  const handleDone = () => {
    markFeedbackAnswered(CONTEXT, memberId);
    setJustAnswered(true);
  };

  return (
    <FeedbackSurveyDialog
      title="프로젝트 매칭 경험이 어떠셨나요?"
      template={{ ...template, templateId: template.templateId }}
      onDone={handleDone}
      listQuestionNumbers={[3]}
    />
  );
};

export default MatchingFeedbackModal;
