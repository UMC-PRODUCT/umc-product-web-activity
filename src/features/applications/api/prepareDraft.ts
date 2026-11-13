import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';

import { findDraftApplicationId } from '../model/findDraftApplicationId';
import { cancelApplication } from './cancelApplication';
import { createApplication } from './createApplication';
import { getMyApplications } from './getMyApplications';

type PrepareDraftParams = {
  gisuId: number | null;
  projectId: number;
  matchingRoundId: number;
};

// 이 프로젝트 · 차수에 쓸 임시저장 지원서 ID를 돌려줌
// - 서버는 차수마다 작성 중인 지원서를 하나만 두고, 초안이 있으면 같은 프로젝트라도 초안 만들기를 거절함 (PROJECT-0210)
// - 그래서 이 프로젝트의 초안이 있으면 그걸 쓰고, 같은 차수의 다른 프로젝트 초안은 철회해서 지운 뒤에만 새로 만듦
// - 철회에 실패한 초안이 있으면 초안 만들기에서 서버 오류로 알려 줌
export const prepareDraft = async ({ gisuId, projectId, matchingRoundId }: PrepareDraftParams) => {
  const drafts = gisuId === null ? [] : await getMyApplications({ gisuId, status: 'DRAFT' });
  const draftId = findDraftApplicationId(drafts, projectId, matchingRoundId);
  if (draftId !== null) return draftId;

  await Promise.allSettled(
    drafts.flatMap((draft) => {
      const otherProjectId = toId(draft.projectId);
      const applicationId = toId(draft.applicationId);
      if (otherProjectId === null || applicationId === null) return [];
      if (draft.status !== 'DRAFT' || toId(draft.matchingRound?.id) !== matchingRoundId) return [];
      return [cancelApplication({ projectId: otherProjectId, applicationId })];
    }),
  );

  const created = await createApplication({ projectId, matchingRoundId });
  const applicationId = toId(created.applicationId);
  if (applicationId === null) {
    throw new ApiError(0, 'APPLICATION_NOT_CREATED', '지원서를 만들지 못했어요.');
  }
  return applicationId;
};
