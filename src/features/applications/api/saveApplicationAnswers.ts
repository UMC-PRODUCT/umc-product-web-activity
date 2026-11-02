import { api } from '@/shared/api/client';
import type { components, operations } from '@/types/api';

type Operation = operations['APPLY-002'];

export type ApplicationAnswerItem = components['schemas']['ApplicationAnswerItem'];
export type SaveApplicationAnswersPath = Operation['parameters']['path'];
export type SaveApplicationAnswersResponse = NonNullable<
  Operation['responses'][200]['content']['*/*']
>;

type SaveApplicationAnswersParams = SaveApplicationAnswersPath & {
  answers: ApplicationAnswerItem[];
};

/** 챌린저 지원서 임시저장 (본문이 답변의 새 전체 상태) */
export const saveApplicationAnswers = ({
  projectId,
  applicationId,
  answers,
}: SaveApplicationAnswersParams) =>
  api.put<SaveApplicationAnswersResponse>(
    `/api/v1/projects/${projectId}/applications/${applicationId}`,
    { answers },
  );
