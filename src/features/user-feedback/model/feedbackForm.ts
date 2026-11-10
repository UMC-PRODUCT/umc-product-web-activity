import type {
  FeedbackQuestion,
  SubmitUserFeedbackRequest,
  UserFeedbackTemplate,
} from '../api/userFeedback';

export type SurveyQuestion = FeedbackQuestion & { questionId: number };

export type SurveyAnswer = {
  optionIds: number[];
  text: string;
};

export type SurveyAnswers = Record<number, SurveyAnswer>;

export const EMPTY_SURVEY_ANSWER: SurveyAnswer = { optionIds: [], text: '' };

const byOrderNo = (a: { orderNo?: number }, b: { orderNo?: number }) =>
  (a.orderNo ?? 0) - (b.orderNo ?? 0);

export const isTextQuestion = (question: FeedbackQuestion) =>
  question.type === 'SHORT_TEXT' || question.type === 'LONG_TEXT';

export const getSurveyQuestions = (template: UserFeedbackTemplate): SurveyQuestion[] =>
  [...(template.form?.sections ?? [])]
    .sort(byOrderNo)
    .flatMap((section) => [...(section.questions ?? [])].sort(byOrderNo))
    .filter((question): question is SurveyQuestion => question.questionId !== undefined)
    .map((question) => ({ ...question, options: [...(question.options ?? [])].sort(byOrderNo) }));

export const isQuestionAnswered = (question: SurveyQuestion, answer: SurveyAnswer | undefined) => {
  if (!answer) return false;
  return isTextQuestion(question) ? answer.text.trim() !== '' : answer.optionIds.length > 0;
};

export const toSurveyAnswerItems = (
  questions: SurveyQuestion[],
  answers: SurveyAnswers,
): SubmitUserFeedbackRequest['answers'] =>
  questions
    .filter((question) => isQuestionAnswered(question, answers[question.questionId]))
    .map((question) => {
      const answer = answers[question.questionId];
      return isTextQuestion(question)
        ? { questionId: question.questionId, textValue: answer.text.trim() }
        : { questionId: question.questionId, selectedOptionIds: answer.optionIds };
    });
