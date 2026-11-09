import { skipToken, useQuery } from '@tanstack/react-query';

import { getManagedProjects } from '../api/getManagedProjects';

// PM이 맡은 이번 기수 프로젝트 중 승인이 끝난 프로젝트 하나 (없으면 null). 기수를 모르면 부르지 않음
// 진행 중 상태 값이 문서와 실제 응답이 달라서(IN_PROGRESS · ACTIVE) 임시저장 · 승인 대기만 뺌
// TODO: 백엔드에 문서 · 응답 상태 값 맞춰 달라고 요청
export const useMyManagedProject = (gisuId: number | null) =>
  useQuery({
    queryKey: ['application-stats', 'managed-project', gisuId],
    queryFn: gisuId === null ? skipToken : () => getManagedProjects({ gisuId }),
    select: ({ content = [] }) =>
      content.find(({ status }) => status !== 'DRAFT' && status !== 'PENDING_REVIEW') ?? null,
  });
