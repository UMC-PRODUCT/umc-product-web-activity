import { useQuery } from '@tanstack/react-query';

import { useSessionStore } from '@/entities/session';

import { getUserFeedbackTemplate } from '../api/userFeedback';
import { useFeedbackModalStore } from '../model/feedbackModalStore';
import { markFeedbackAnswered } from '../model/feedbackStorage';
import FeedbackSurveyDialog from './FeedbackSurveyDialog';

const CONTEXT = 'APPLICATION_SUBMITTED';

const ApplicationFeedbackModal = () => {
  const memberId = useSessionStore((state) => state.session.memberId);
  const open = useFeedbackModalStore((state) => state.open);
  const hide = useFeedbackModalStore((state) => state.hide);

  const { data: template } = useQuery({
    queryKey: ['user-feedback-template', CONTEXT],
    queryFn: () => getUserFeedbackTemplate(CONTEXT),
    enabled: open && memberId !== null,
    staleTime: Infinity,
  });

  if (!open || memberId === null || !template || template.templateId === undefined) return null;

  const handleDone = () => {
    markFeedbackAnswered(CONTEXT, memberId);
    hide();
  };

  return (
    <FeedbackSurveyDialog
      title="프로젝트 지원 경험이 어떠셨나요?"
      template={{ ...template, templateId: template.templateId }}
      onDone={handleDone}
    />
  );
};

export default ApplicationFeedbackModal;
