import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';

import { createApplication } from '../api/createApplication';
import { applicationKeys } from '../api/queryKeys';
import { type ApplicationAnswerItem, saveApplicationAnswers } from '../api/saveApplicationAnswers';
import { submitApplication } from '../api/submitApplication';

type SubmitParams = {
  projectId: number;
  matchingRoundId: number;
  answers: ApplicationAnswerItem[];
};

// 지원서 제출: 초안 만들기 → 답변 저장 → 최종 제출을 차례로 보냄 (초안이 이미 있으면 그 지원서를 이어 씀)
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, matchingRoundId, answers }: SubmitParams) => {
      const draft = await createApplication({ projectId, matchingRoundId });
      const applicationId = toId(draft.applicationId);
      if (applicationId === null) {
        throw new ApiError(0, 'APPLICATION_NOT_CREATED', '지원서를 만들지 못했어요.');
      }

      await saveApplicationAnswers({ projectId, applicationId, answers });
      return submitApplication({ projectId, applicationId });
    },
    // 내 지원 현황 · 프로젝트 목록의 지원 상태 · 모집 인원이 바로 바뀌도록 다시 불러옴
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['project-applications'] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ]),
  });
};
