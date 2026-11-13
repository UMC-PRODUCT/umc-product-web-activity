import { describe, expect, it } from 'vitest';

import type { MyApplicationsResponse } from '../api/getMyApplications';
import { findDraftApplicationId } from './findDraftApplicationId';

const drafts: MyApplicationsResponse = [
  { applicationId: 1, projectId: 10, matchingRound: { id: 100 }, status: 'DRAFT' },
  { applicationId: 2, projectId: 10, matchingRound: { id: 200 }, status: 'DRAFT' },
  { applicationId: 3, projectId: 20, matchingRound: { id: 200 }, status: 'DRAFT' },
  { applicationId: 4, projectId: 30, matchingRound: { id: 200 }, status: 'SUBMITTED' },
];

describe('findDraftApplicationId', () => {
  it('프로젝트와 매칭 차수가 모두 같은 초안을 찾는다', () => {
    expect(findDraftApplicationId(drafts, 10, 200)).toBe(2);
    expect(findDraftApplicationId(drafts, 20, 200)).toBe(3);
  });

  it('지난 차수의 초안은 불러오지 않는다', () => {
    expect(findDraftApplicationId(drafts, 20, 100)).toBeNull();
  });

  it('임시저장 상태가 아닌 지원서는 건너뛴다', () => {
    expect(findDraftApplicationId(drafts, 30, 200)).toBeNull();
  });

  it('목록이 비어 있으면 null', () => {
    expect(findDraftApplicationId([], 10, 200)).toBeNull();
  });
});
