import { api } from '@/shared/api/client';

/** 프로젝트 공개 (승인 대기 → 승인 완료, 지원 폼도 함께 공개). 운영진만 호출할 수 있고 PM은 막힘 */
export const publishProject = (projectId: number) =>
  api.post<unknown>(`/api/v1/projects/${projectId}/publish`);
