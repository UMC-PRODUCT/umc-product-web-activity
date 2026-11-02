import { useQuery } from '@tanstack/react-query';

import { getProjectDetail } from '../api/getProjectDetail';
import { applyProjectDetail, toProject } from '../lib/toProject';

// 주소의 프로젝트 ID로 프로젝트 한 건을 불러옴 (목록을 거치지 않고 바로 열리는 지원서 화면용)
// 지부는 상세 응답에 없어서 모름(null). 팀원 구성은 쓰지 않아 불러오지 않음
export const useProjectById = (projectId: number) =>
  useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectDetail(projectId),
    select: (detail) => applyProjectDetail(toProject(detail, null), detail, undefined),
  });
