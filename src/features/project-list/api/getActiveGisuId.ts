import { api } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';
import type { components } from '@/types/api';

type GisuOrganizationResponse = components['schemas']['GisuOrganizationV2Response'];

/** 활성 기수 ID 조회. 문서에는 request 객체지만 실제로는 평평한 query (?active=true) */
export const getActiveGisuId = async () => {
  const { gisus } = await api.get<GisuOrganizationResponse>('/api/v2/gisu', { active: true });
  return toId(gisus?.[0]?.gisuId);
};
