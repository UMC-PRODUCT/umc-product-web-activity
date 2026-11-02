import type { MatchingRoundsResponse } from '../api/getMatchingRounds';
import { findApplyRoundId } from './findApplyRoundId';

// 서버는 ID를 문자열로 줌
const rounds = [
  { id: '1', type: 'PLAN_DESIGN', phase: 'FIRST' },
  { id: '2', type: 'PLAN_DESIGN', phase: 'SECOND' },
  { id: '4', type: 'PLAN_DEVELOPER', phase: 'FIRST' },
  { id: '6', type: 'PLAN_DEVELOPER', phase: 'THIRD' },
] as unknown as MatchingRoundsResponse;

describe('findApplyRoundId', () => {
  it('트랙과 차수가 맞는 매칭 차수 ID를 숫자로 돌려준다', () => {
    expect(findApplyRoundId(rounds, 'DESIGN', 2)).toBe(2);
    expect(findApplyRoundId(rounds, 'PE', 1)).toBe(4);
  });

  it('PE 트랙은 DESIGN 트랙의 같은 차수와 헷갈리지 않는다', () => {
    expect(findApplyRoundId(rounds, 'PE', 3)).toBe(6);
    expect(findApplyRoundId(rounds, 'DESIGN', 3)).toBeNull();
  });

  it('해당 차수가 없으면 null', () => {
    expect(findApplyRoundId([], 'DESIGN', 1)).toBeNull();
  });
});
