import {
  getProjectActions,
  NOTICE_ALREADY_APPLIED,
  NOTICE_NOT_APPLY_PERIOD,
  NOTICE_PART_MISMATCH,
  NOTICE_RECRUIT_CLOSED,
} from './getProjectActions';
import type { PartRecruitment, Project, ProjectPeriod, ProjectViewer } from './types';

const recruit = (
  part: PartRecruitment['part'],
  status: PartRecruitment['status'],
): PartRecruitment => ({ part, applied: 0, capacity: 1, status, members: [] });

const PROJECT: Project = {
  projectId: 'p1',
  projectName: 'UMC Web',
  logoUrl: null,
  thumbnailUrl: null,
  pmName: '닉네임/이름',
  schoolName: '중앙대',
  chapterId: 'otter',
  description: '',
  platform: 'WEB',
  planUrl: null,
  recruitments: [recruit('DESIGN', 'RECRUITING'), recruit('WEB_PE', 'RECRUITING')],
};

const APPLY: ProjectPeriod = { track: 'PE', phase: 'APPLY', round: 1 };
const MATCHING: ProjectPeriod = { track: 'PE', phase: 'MATCHING', round: 1 };
const REGISTER: ProjectPeriod = { track: 'PE', phase: 'REGISTER', round: 1 };

const VIEWER: ProjectViewer = {
  challengerPart: 'DESIGN',
  myProjectId: null,
  appliedProjectId: null,
  isMatched: false,
};

const base = { chapterId: 'otter', project: PROJECT, period: APPLY, viewer: VIEWER };

describe('getProjectActions - 일반 챌린저', () => {
  const challenger = { ...base, role: 'CHALLENGER' as const, view: 'CHALLENGER' as const };

  it('본인 지부 프로젝트에 지원 기간이면 지원하기가 활성이다', () => {
    expect(getProjectActions(challenger).primary).toEqual({
      kind: 'APPLY',
      label: '지원하기',
      disabled: false,
      notice: null,
    });
  });

  it('매칭 기간이면 지원하기가 비활성이다', () => {
    expect(getProjectActions({ ...challenger, period: MATCHING }).primary).toMatchObject({
      disabled: true,
      notice: NOTICE_NOT_APPLY_PERIOD,
    });
  });

  it('등록 기간이면 지원하기가 비활성이다', () => {
    const action = getProjectActions({
      ...base,
      role: 'CHALLENGER',
      view: 'CHALLENGER',
      period: REGISTER,
    }).primary;
    expect(action).toMatchObject({
      kind: 'APPLY',
      disabled: true,
      notice: NOTICE_NOT_APPLY_PERIOD,
    });
  });

  it('타 지부 프로젝트는 기획보기만 보인다', () => {
    expect(getProjectActions({ ...challenger, chapterId: 'quokka' }).primary).toBeNull();
  });

  it('이미 매칭된 챌린저는 기획보기만 보인다', () => {
    const viewer = { ...VIEWER, isMatched: true };
    expect(getProjectActions({ ...challenger, viewer }).primary).toBeNull();
  });

  it('지원한 프로젝트는 매칭 기간에도 내 지원서 보기가 활성이다', () => {
    const viewer = { ...VIEWER, appliedProjectId: 'p1' };
    for (const period of [APPLY, MATCHING]) {
      expect(getProjectActions({ ...challenger, viewer, period }).primary).toMatchObject({
        kind: 'MY_APPLICATION',
        disabled: false,
        notice: null,
      });
    }
  });

  it('다른 프로젝트에 이미 지원했으면 지원하기가 비활성이다', () => {
    const viewer = { ...VIEWER, appliedProjectId: 'p2' };
    expect(getProjectActions({ ...challenger, viewer }).primary).toMatchObject({
      disabled: true,
      notice: NOTICE_ALREADY_APPLIED,
    });
  });

  it('모집 파트가 다르면 지원하기가 비활성이다', () => {
    const project = { ...PROJECT, recruitments: [recruit('WEB_PE', 'RECRUITING')] };
    expect(getProjectActions({ ...challenger, project }).primary).toMatchObject({
      disabled: true,
      notice: NOTICE_PART_MISMATCH,
    });
  });

  it('전 파트가 마감이면 모집 마감 안내가 파트 불일치 · 이미 지원 안내보다 먼저다', () => {
    const project = { ...PROJECT, recruitments: [recruit('WEB_PE', 'CLOSED')] };
    const viewer = { ...VIEWER, appliedProjectId: 'p2' };
    expect(getProjectActions({ ...challenger, project, viewer }).primary).toMatchObject({
      notice: NOTICE_RECRUIT_CLOSED,
    });
  });

  it('내 파트만 마감이어도 모집 마감 안내가 나온다', () => {
    const project = {
      ...PROJECT,
      recruitments: [recruit('DESIGN', 'CLOSED'), recruit('WEB_PE', 'RECRUITING')],
    };
    expect(getProjectActions({ ...challenger, project }).primary).toMatchObject({
      notice: NOTICE_RECRUIT_CLOSED,
    });
  });
});

describe('getProjectActions - 운영진', () => {
  it.each(['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN', 'CHAPTER_ADMIN'] as const)(
    '%s는 등록 · 지원 기간에 모집 문항 보기가 활성이다',
    (role) => {
      for (const period of [REGISTER, APPLY]) {
        const action = getProjectActions({ ...base, role, view: 'ADMIN', period }).primary;
        expect(action).toMatchObject({ kind: 'RECRUIT_QUESTIONS', disabled: false, notice: null });
      }
    },
  );

  it.each(['SUPER_ADMIN', 'HQ_LEAD', 'HQ_ADMIN', 'CHAPTER_ADMIN'] as const)(
    '%s는 매칭 기간에 모집 문항 보기가 비활성이고 지원 기간 아님 안내가 나온다',
    (role) => {
      const action = getProjectActions({ ...base, role, view: 'ADMIN', period: MATCHING }).primary;
      expect(action).toMatchObject({
        kind: 'RECRUIT_QUESTIONS',
        disabled: true,
        notice: NOTICE_NOT_APPLY_PERIOD,
      });
    },
  );

  it('운영진에게는 프로젝트 수정하기가 나오지 않는다', () => {
    const action = getProjectActions({
      ...base,
      role: 'SUPER_ADMIN',
      view: 'ADMIN',
      period: REGISTER,
    }).primary;
    expect(action?.kind).not.toBe('EDIT_PROJECT');
  });
});

describe('getProjectActions - PM', () => {
  const pm = { ...base, role: 'CHALLENGER_PM' as const, view: 'PM_CHALLENGER' as const };

  it('매칭 기간에 PM은 본인 프로젝트만 수정할 수 있다', () => {
    const viewer = { ...VIEWER, myProjectId: 'p1' };
    expect(getProjectActions({ ...pm, viewer, period: MATCHING }).primary).toMatchObject({
      kind: 'EDIT_PROJECT',
    });
    expect(
      getProjectActions({ ...pm, viewer: { ...viewer, myProjectId: 'p2' }, period: MATCHING })
        .primary,
    ).toMatchObject({ kind: 'RECRUIT_QUESTIONS', disabled: true });
  });

  it('지원 기간에는 PM도 본인 프로젝트를 수정할 수 없다', () => {
    const viewer = { ...VIEWER, myProjectId: 'p1' };
    expect(getProjectActions({ ...pm, viewer }).primary).toMatchObject({
      kind: 'RECRUIT_QUESTIONS',
      disabled: false,
    });
  });
});

describe('getProjectActions - 팀원 구성', () => {
  const admin = { ...base, role: 'SUPER_ADMIN' as const, view: 'ADMIN' as const };

  it('차수 · 지원 기간 · 매칭 기간과 관계없이 항상 보인다', () => {
    for (const phase of ['APPLY', 'MATCHING'] as const) {
      for (const round of [1, 2, 3] as const) {
        expect(
          getProjectActions({ ...admin, period: { track: 'PE', phase, round } }).showTeamButton,
        ).toBe(true);
      }
    }
  });
});
