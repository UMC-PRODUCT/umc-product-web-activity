import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelApplication } from '../api/cancelApplication';
import { applicationKeys } from '../api/queryKeys';

// 지원 취소 (지원 기간인 차수의 지원서만 가능)
export const useCancelApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelApplication,
    // 취소한 지원서가 목록에서 빠지도록 내 지원 목록 · 지원서, 프로젝트 목록의 지원 여부 · 지원 인원을 다시 불러옴
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
        queryClient.invalidateQueries({ queryKey: ['project-applications'] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ]),
  });
};
