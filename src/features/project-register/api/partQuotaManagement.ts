import { api } from '@/shared/api/client';
import type { components } from '@/types/api';

export type PartQuotaEntry = components['schemas']['UpdatePartQuotasRequest']['entries'][number];

/** 프로젝트 파트별 정원 일괄 갱신 (본문으로 전체 교체, 생략한 파트는 삭제). 지부 ID 없이 초안에도 쓸 수 있음 */
export const updatePartQuotas = (projectId: number, entries: PartQuotaEntry[]) =>
  api.put<unknown>(`/api/v1/projects/${projectId}/part-quotas`, { entries });
