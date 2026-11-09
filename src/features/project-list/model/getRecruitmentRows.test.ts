import { getRecruitmentRows, maskTeamRecruitments } from './getRecruitmentRows';
import type { PartRecruitment } from './types';

const recruit = (part: PartRecruitment['part'], applied: number, capacity: number) => ({
  part,
  applied,
  capacity,
  status: 'RECRUITING' as const,
  members: [],
});

const project = { recruitments: [recruit('DESIGN', 1, 2), recruit('MOBILE_PE', 3, 4)] };

describe('getRecruitmentRows', () => {
  it('PE 매칭 기간에는 모든 파트의 TO를 그대로 표기한다', () => {
    expect(getRecruitmentRows(project, { track: 'PE' }, 'card')).toMatchObject([
      { label: 'Design', applied: 1, capacity: 2 },
      { label: 'Mobile PE', applied: 3, capacity: 4 },
    ]);
  });

  it('디자인 매칭 기간에는 Design만 TO를 표기하고 PE는 라벨만 두고 0/0이다', () => {
    expect(getRecruitmentRows(project, { track: 'DESIGN' }, 'card')).toMatchObject([
      { label: 'Design', applied: 1, capacity: 2 },
      { label: 'Mobile', applied: 0, capacity: 0 },
    ]);
  });

  it('상세 모달은 PE를 플랫폼 이름으로 표기한다', () => {
    expect(getRecruitmentRows(project, { track: 'PE' }, 'detail').map((row) => row.label)).toEqual([
      'Design',
      'Mobile',
    ]);
  });
});

describe('maskTeamRecruitments', () => {
  const member = { memberId: '1', challengerName: '가/나', schoolName: '다', round: 1 as const };
  const recruitments = [
    { ...recruit('DESIGN', 1, 2), members: [member] },
    { ...recruit('MOBILE_PE', 3, 4), members: [member] },
  ];

  it('디자인 매칭 기간에는 PE 파트의 인원과 팀원을 비운다', () => {
    expect(maskTeamRecruitments(recruitments, { track: 'DESIGN' })).toMatchObject([
      { part: 'DESIGN', capacity: 2, members: [member] },
      { part: 'MOBILE_PE', applied: 0, capacity: 0, members: [] },
    ]);
  });

  it('PE 매칭 기간에는 그대로 둔다', () => {
    expect(maskTeamRecruitments(recruitments, { track: 'PE' })).toEqual(recruitments);
  });
});
