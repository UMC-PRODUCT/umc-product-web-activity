import { api } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';
import type { components } from '@/types/api';

type GisuOrganizationResponse = components['schemas']['GisuOrganizationV2Response'];

/** 기수 정보 조회. 문서에는 request 객체지만 실제로는 평평한 query (?id=6&id=8) */
export const getGisus = (gisuIds: number[]) =>
  api.get<GisuOrganizationResponse>('/api/v2/gisu', { id: gisuIds });

// 기수 시작일의 연도 (한국 시간 기준). 시작일이 없거나 읽을 수 없으면 null
const toYear = (startAt: string | undefined) => {
  if (!startAt) return null;
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { timeZone: 'Asia/Seoul', year: 'numeric' });
};

// 기수 ID → 연도
export const toGisuYears = ({ gisus }: GisuOrganizationResponse) => {
  const years = new Map<number, string>();
  (gisus ?? []).forEach(({ gisuId, startAt }) => {
    const id = toId(gisuId);
    const year = toYear(startAt);
    if (id !== null && year !== null) years.set(id, year);
  });
  return years;
};
