import { useQuery } from '@tanstack/react-query';

import type { Session } from '@/entities/session';

import { getActiveGisuId } from '../api/getActiveGisuId';

// 프로젝트 목록을 보여줄 기수. 로그인했으면 내 현재 기수, 비로그인은 내 정보가 없어서 활성 기수
export const useProjectGisuId = ({ memberId, gisuId }: Pick<Session, 'memberId' | 'gisuId'>) => {
  const isSignedIn = memberId !== null;
  const { data: activeGisuId = null } = useQuery({
    queryKey: ['gisu', 'active'],
    queryFn: getActiveGisuId,
    enabled: !isSignedIn,
  });

  return isSignedIn ? gisuId : activeGisuId;
};
