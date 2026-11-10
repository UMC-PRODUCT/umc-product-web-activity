import { useMutation } from '@tanstack/react-query';
import { Button, Dimmed } from '@umc-product/react';
import { AnimatePresence, motion } from 'motion/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { ApiError } from '@/shared/api/client';

import { submitUserFeedback, type UserFeedbackTemplate } from '../api/userFeedback';
import {
  EMPTY_SURVEY_ANSWER,
  getSurveyQuestions,
  isQuestionAnswered,
  type SurveyAnswers,
  type SurveyQuestion,
  toSurveyAnswerItems,
} from '../model/feedbackForm';
import SurveyQuestionField from './SurveyQuestionField';

const CARD_BACKGROUND =
  'linear-gradient(-76.49deg, rgba(34, 144, 132, 0.03) 16.53%, rgba(255, 255, 255, 0.1) 30.04%), linear-gradient(108.42deg, rgba(34, 144, 132, 0.05) 8.35%, rgba(255, 255, 255, 0.1) 46.7%), #fff';

const isAlreadyAnswered = (error: unknown) =>
  error instanceof ApiError && (error.status === 409 || /DUPLICATE|ALREADY/i.test(error.code));

type FeedbackSurveyDialogProps = {
  title: string;
  template: UserFeedbackTemplate & { templateId: number };
  onDone: () => void;
};

const FeedbackSurveyDialog = ({ title, template, onDone }: FeedbackSurveyDialogProps) => {
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const questions = getSurveyQuestions(template);
  const requiredQuestions = questions.filter((question) => question.isRequired);
  const optionalQuestions = questions.filter((question) => !question.isRequired);
  const isRequiredComplete = requiredQuestions.every((question) =>
    isQuestionAnswered(question, answers[question.questionId]),
  );

  const submit = useMutation({
    mutationFn: () =>
      submitUserFeedback({
        templateId: template.templateId,
        answers: toSurveyAnswerItems(questions, answers),
      }),
    onSuccess: onDone,
    onError: (error) => {
      if (isAlreadyAnswered(error)) onDone();
    },
  });

  const renderQuestion = (question: SurveyQuestion) => (
    <div key={question.questionId} className="flex flex-col items-center gap-5">
      <div className="flex w-full items-center gap-2.5">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[13px] leading-[1.45] font-semibold text-teal-600 shadow-[inset_-1px_2.5px_4px_0_rgba(228,228,228,0.2)]">
          {questions.indexOf(question) + 1}
        </span>
        <p className="flex-1 text-title-3-medium font-semibold text-teal-700">{question.title}</p>
      </div>
      <SurveyQuestionField
        question={question}
        answer={answers[question.questionId] ?? EMPTY_SURVEY_ANSWER}
        onChange={(answer) => setAnswers((prev) => ({ ...prev, [question.questionId]: answer }))}
      />
    </div>
  );

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Dimmed />
        </Dialog.Overlay>
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          className="fixed inset-0 z-(--umc-z-dimmed) flex overflow-y-auto px-5 py-10 outline-none"
        >
          <div className="m-auto flex w-[600px] max-w-full flex-col items-center">
            <span className="relative z-[2] -mb-5 flex min-h-9 items-center justify-center rounded-full bg-teal-800 px-4 text-title-4-semibold text-teal-grey-50">
              UMC Matching System
            </span>
            <section
              className="relative z-[1] flex w-full flex-col items-center gap-[42px] rounded-2xl border-[0.8px] border-white px-8 pt-[54px] pb-8 drop-shadow-[0_4px_8px_rgba(64,68,67,0.16)]"
              style={{ background: CARD_BACKGROUND }}
            >
              <div className="flex w-full max-w-[484px] flex-col items-center gap-[42px]">
                <Dialog.Title className="text-[26px] leading-[1.3] font-semibold tracking-[-0.52px] text-teal-grey-900">
                  {title}
                </Dialog.Title>
                <div className="flex w-full flex-col">
                  <div className="flex flex-col gap-12">
                    {requiredQuestions.map(renderQuestion)}
                  </div>
                  <AnimatePresence initial={false}>
                    {isRequiredComplete && optionalQuestions.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-12 pt-12">
                          {optionalQuestions.map(renderQuestion)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex w-full items-center justify-end gap-3">
                {submit.isError && !isAlreadyAnswered(submit.error) && (
                  <p role="alert" className="flex-1 text-body-3-medium text-red-500">
                    {submit.error.message}
                  </p>
                )}
                <Button
                  size="sm"
                  disabled={!isRequiredComplete}
                  isLoading={submit.isPending}
                  onClick={() => submit.mutate()}
                >
                  전달하기
                </Button>
              </div>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FeedbackSurveyDialog;
