import { toId } from '@/shared/api/toId';

import type { MyApplicationsResponse } from '../api/getMyApplications';

// 임시저장 목록에서 프로젝트와 매칭 차수가 모두 같은 지원서 ID (없으면 null)
export const findDraftApplicationId = (
  drafts: MyApplicationsResponse,
  projectId: number,
  matchingRoundId: number,
) => {
  const draft = drafts.find(
    (item) =>
      item.status === 'DRAFT' &&
      toId(item.projectId) === projectId &&
      toId(item.matchingRound?.id) === matchingRoundId,
  );
  return toId(draft?.applicationId);
};
