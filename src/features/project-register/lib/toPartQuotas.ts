import type { PartQuotaEntry } from '../api/partQuotaManagement';
import type { PePlatform, RecruitInfo } from '../model/types';

type Entry = PartQuotaEntry;

const PE_PART: Record<PePlatform, Entry['part']> = {
  WEB: 'WEB_PRODUCT_ENGINEER',
  MOBILE: 'MOBILE_PRODUCT_ENGINEER',
};

// 모집 정보 → 파트별 정원. 서버가 본문으로 전체를 교체하고 quota는 1 이상이어야 하므로, 쓰지 않는 파트는 빼서 이전 정원을 지움
export const toPartQuotaEntries = ({ designCount, peCount, pePlatform }: RecruitInfo): Entry[] => {
  const entries: Entry[] = [
    { part: 'DESIGN', quota: designCount },
    { part: PE_PART.WEB, quota: pePlatform === 'WEB' ? peCount : 0 },
    { part: PE_PART.MOBILE, quota: pePlatform === 'MOBILE' ? peCount : 0 },
  ];
  return entries.filter(({ quota }) => quota > 0);
};

// 프로젝트 상세의 파트별 정원 → 모집 정보 (PM이 운영진이 정해 둔 모집 정보를 볼 때도 씀)
export const fromPartQuotas = (
  partQuotas: { part?: string; quota?: number }[] | undefined,
): RecruitInfo | null => {
  if (!partQuotas || partQuotas.length === 0) return null;

  // 서버가 숫자를 문자열("1")로 내려줘서 숫자로 맞춤. 그대로 두면 합계가 문자열 이어붙이기("1" + 0 = "10")가 됨
  const find = (part: string) => Number(partQuotas.find((item) => item.part === part)?.quota ?? 0);
  const webCount = find(PE_PART.WEB);
  const mobileCount = find(PE_PART.MOBILE);

  return {
    designCount: find('DESIGN'),
    peCount: Math.max(webCount, mobileCount),
    pePlatform: webCount > 0 ? 'WEB' : mobileCount > 0 ? 'MOBILE' : null,
  };
};
