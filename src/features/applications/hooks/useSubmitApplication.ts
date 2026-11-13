import { useMutation, useQueryClient } from '@tanstack/react-query';

import { prepareDraft } from '../api/prepareDraft';
import { applicationKeys } from '../api/queryKeys';
import { type ApplicationAnswerItem, saveApplicationAnswers } from '../api/saveApplicationAnswers';
import { submitApplication } from '../api/submitApplication';

type SubmitParams = {
  gisuId: number | null;
  projectId: number;
  matchingRoundId: number;
  answers: ApplicationAnswerItem[];
};

// 지원서 제출: 쓸 초안 준비 → 답변 저장 → 최종 제출을 차례로 보냄
// (이 프로젝트의 초안이 있으면 이어 쓰고, 없으면 같은 차수의 다른 프로젝트 초안을 지우고 새로 만듦)
export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gisuId, projectId, matchingRoundId, answers }: SubmitParams) => {
      const applicationId = await prepareDraft({ gisuId, projectId, matchingRoundId });
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
