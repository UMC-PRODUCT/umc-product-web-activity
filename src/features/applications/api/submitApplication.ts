import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-003'];

export type SubmitApplicationPath = Operation['parameters']['path'];
export type SubmitApplicationResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 챌린저 지원서 최종 제출 (필수 답변이 빠지면 400) */
export const submitApplication = ({ projectId, applicationId }: SubmitApplicationPath) =>
  api.post<SubmitApplicationResponse>(
    `/api/v1/projects/${projectId}/applications/${applicationId}/submit`,
  );
