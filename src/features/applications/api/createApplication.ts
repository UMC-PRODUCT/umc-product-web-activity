import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['APPLY-001'];

export type CreateApplicationPath = Operation['parameters']['path'];
export type CreateApplicationResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

type CreateApplicationParams = CreateApplicationPath & {
  matchingRoundId: number;
};

/** 챌린저 지원서 초안 생성 (이미 초안이 있으면 기존 지원서를 돌려줌) */
export const createApplication = ({ projectId, matchingRoundId }: CreateApplicationParams) =>
  api.post<CreateApplicationResponse>(`/api/v1/projects/${projectId}/applications`, {
    matchingRoundId,
  });
