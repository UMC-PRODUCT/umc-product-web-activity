import type { ProjectRegisterAccess, Role, View } from '../model/types';
import {
  canEditApplicantStatus,
  canManageMatching,
  canManageNotice,
  canModifyNotice,
  getApplicationsAccess,
  getApplicationsView,
  getChapterScope,
  getMatchingScheduleAccess,
  getProjectRegisterAccess,
  getProjectSettingsAccess,
  getViewOptions,
} from './access';

describe('getChapterScope', () => {
  it.each<[Role, 'ALL' | 'OWN']>([
    ['SUPER_ADMIN', 'ALL'],
    ['HQ_LEAD', 'ALL'],
    ['HQ_ADMIN', 'ALL'],
    ['CHAPTER_ADMIN', 'OWN'],
    ['SCHOOL_ADMIN', 'OWN'],
    ['SCHOOL_STAFF', 'OWN'],
  ])('%s의 지부 조회 범위는 %s', (role, expected) => {
    expect(getChapterScope(role)).toBe(expected);
  });
});

describe('getApplicationsView', () => {
  it.each<[Role, View]>([
    ['SUPER_ADMIN', 'ADMIN'],
    ['HQ_LEAD', 'ADMIN'],
    ['HQ_ADMIN', 'ADMIN'],
    ['CHAPTER_ADMIN', 'ADMIN'],
    ['SCHOOL_ADMIN', 'ADMIN'],
    ['SCHOOL_STAFF', 'ADMIN'],
    ['CHALLENGER_PM', 'PM_CHALLENGER'],
    ['CHALLENGER', 'CHALLENGER'],
  ])('Admin View에서 %s는 %s 화면을 본다', (role, expected) => {
    expect(getApplicationsView(role, 'ADMIN')).toBe(expected);
  });

  it('운영진도 챌린저 뷰로 전환하면 해당 챌린저 화면을 본다', () => {
    expect(getApplicationsView('HQ_ADMIN', 'PM_CHALLENGER')).toBe('PM_CHALLENGER');
    expect(getApplicationsView('SUPER_ADMIN', 'CHALLENGER')).toBe('CHALLENGER');
  });
});

describe('canEditApplicantStatus', () => {
  it.each<[Role, boolean]>([
    ['SUPER_ADMIN', true],
    ['HQ_LEAD', true],
    ['HQ_ADMIN', false],
    ['SCHOOL_ADMIN', false],
    ['SCHOOL_STAFF', false],
  ])('Admin View에서 %s의 배정 상태 변경 가능 여부는 %s', (role, expected) => {
    expect(canEditApplicantStatus({ role, chapterId: 'axolotl' }, 'ADMIN', 'axolotl')).toBe(
      expected,
    );
  });

  it('지부장은 본인 지부 프로젝트만 바꿀 수 있다', () => {
    const session = { role: 'CHAPTER_ADMIN' as const, chapterId: 'axolotl' };
    expect(canEditApplicantStatus(session, 'ADMIN', 'axolotl')).toBe(true);
    expect(canEditApplicantStatus(session, 'ADMIN', 'quokka')).toBe(false);
  });

  it('PM 뷰는 본인 프로젝트만 보이므로 바꿀 수 있고, 챌린저 뷰는 바꿀 수 없다', () => {
    const session = { role: 'CHALLENGER_PM' as const, chapterId: 'axolotl' };
    expect(canEditApplicantStatus(session, 'PM_CHALLENGER', null)).toBe(true);
    expect(canEditApplicantStatus(session, 'CHALLENGER', null)).toBe(false);
  });
});

describe('canManageMatching', () => {
  it.each<[Role, boolean]>([
    ['SUPER_ADMIN', true],
    ['HQ_LEAD', true],
    ['HQ_ADMIN', false],
    ['SCHOOL_ADMIN', false],
    ['SCHOOL_STAFF', false],
  ])('Admin View에서 %s의 수동 배정 · 매칭 해제 가능 여부는 %s', (role, expected) => {
    expect(canManageMatching({ role, chapterId: 'axolotl' }, 'ADMIN', 'axolotl')).toBe(expected);
  });

  it('지부장은 소속 지부 프로젝트만 수동 배정 · 매칭 해제할 수 있다', () => {
    const session = { role: 'CHAPTER_ADMIN' as const, chapterId: 'axolotl' };
    expect(canManageMatching(session, 'ADMIN', 'axolotl')).toBe(true);
    expect(canManageMatching(session, 'ADMIN', 'quokka')).toBe(false);
  });

  it('어드민 뷰가 아니면 조회만 가능하다', () => {
    const session = { role: 'SUPER_ADMIN' as const, chapterId: null };
    expect(canManageMatching(session, 'PM_CHALLENGER', null)).toBe(false);
    expect(canManageMatching(session, 'CHALLENGER', null)).toBe(false);
  });
});

describe('getMatchingScheduleAccess', () => {
  it.each<[Role, 'ALL' | 'OWN', 'ALL' | 'OWN' | 'NONE']>([
    ['SUPER_ADMIN', 'ALL', 'ALL'],
    ['HQ_LEAD', 'ALL', 'ALL'],
    ['HQ_ADMIN', 'ALL', 'NONE'],
    ['CHAPTER_ADMIN', 'OWN', 'OWN'],
    ['SCHOOL_ADMIN', 'OWN', 'NONE'],
  ])('%s는 %s 지부를 보고, %s 지부 일정을 바꿀 수 있다', (role, chapterScope, editScope) => {
    expect(getMatchingScheduleAccess(role)).toEqual({ chapterScope, editScope });
  });
});

describe('getApplicationsAccess', () => {
  it.each<[Role, boolean, boolean, boolean]>([
    ['SUPER_ADMIN', true, true, true],
    ['HQ_LEAD', true, true, true],
    ['CHAPTER_ADMIN', true, true, true],
    ['HQ_ADMIN', true, false, false],
    ['SCHOOL_ADMIN', true, false, false],
    ['SCHOOL_STAFF', true, false, false],
    ['CHALLENGER', false, false, false],
  ])(
    '%s: 지원 시트 %s, 지원서 모달 %s, 개인 지원서 %s',
    (role, canReadApplicants, canOpenProject, canReadApplication) => {
      expect(getApplicationsAccess(role)).toEqual({
        canReadApplicants,
        canOpenProject,
        canReadApplication,
      });
    },
  );
});

describe('getProjectSettingsAccess', () => {
  it.each<[Role, 'FULL' | 'BASIC' | 'NONE']>([
    ['SUPER_ADMIN', 'FULL'],
    ['HQ_LEAD', 'FULL'],
    ['HQ_ADMIN', 'FULL'],
    ['CHAPTER_ADMIN', 'FULL'],
    ['SCHOOL_ADMIN', 'NONE'],
    ['SCHOOL_STAFF', 'NONE'],
    ['CHALLENGER_PM', 'BASIC'],
    ['CHALLENGER', 'NONE'],
  ])('Admin View에서 %s는 %s', (role, expected) => {
    expect(getProjectSettingsAccess(role, 'ADMIN')).toBe(expected);
  });

  it('챌린저 뷰로 전환하면 원래 권한과 상관없이 뷰 기준으로 접근한다', () => {
    expect(getProjectSettingsAccess('HQ_ADMIN', 'PM_CHALLENGER')).toBe('BASIC');
    expect(getProjectSettingsAccess('HQ_ADMIN', 'CHALLENGER')).toBe('NONE');
  });
});

describe('getViewOptions', () => {
  it('PM을 겸하는 운영진은 PM 챌린저 뷰로 전환한다', () => {
    expect(getViewOptions({ challengerType: 'PM' })).toEqual([
      { value: 'ADMIN', label: 'Admin View' },
      { value: 'PM_CHALLENGER', label: 'PM Challenger View' },
    ]);
  });

  it('일반 챌린저를 겸하는 운영진은 챌린저 뷰로 전환한다', () => {
    expect(getViewOptions({ challengerType: 'GENERAL' })).toEqual([
      { value: 'ADMIN', label: 'Admin View' },
      { value: 'CHALLENGER', label: 'Challenger View' },
    ]);
  });

  it('어드민 권한만 있으면 뷰 전환이 없다', () => {
    expect(getViewOptions({ challengerType: null })).toEqual([]);
  });
});

describe('canModifyNotice', () => {
  it('최고 관리자는 누가 쓴 공지든 수정 · 삭제할 수 있다', () => {
    expect(canModifyNotice('SUPER_ADMIN', 1, 2)).toBe(true);
    expect(canModifyNotice('SUPER_ADMIN', null, undefined)).toBe(true);
  });

  it('지부장은 본인이 쓴 공지만 수정 · 삭제할 수 있다', () => {
    expect(canModifyNotice('CHAPTER_ADMIN', 1, 1)).toBe(true);
    expect(canModifyNotice('CHAPTER_ADMIN', 1, 2)).toBe(false);
  });

  it('작성자를 알 수 없는 공지는 지부장이 수정 · 삭제할 수 없다', () => {
    expect(canModifyNotice('CHAPTER_ADMIN', 1, undefined)).toBe(false);
    expect(canModifyNotice('CHAPTER_ADMIN', 1, null)).toBe(false);
    expect(canModifyNotice('CHAPTER_ADMIN', null, null)).toBe(false);
  });
});

describe('canManageNotice', () => {
  it('SUPER_ADMIN은 모든 지부의 공지를 관리한다', () => {
    expect(canManageNotice('SUPER_ADMIN', 'axolotl', 'otter')).toBe(true);
    expect(canManageNotice('SUPER_ADMIN', null, 'otter')).toBe(true);
  });

  it('지부장은 본인 지부의 공지만 관리한다', () => {
    expect(canManageNotice('CHAPTER_ADMIN', 'axolotl', 'axolotl')).toBe(true);
    expect(canManageNotice('CHAPTER_ADMIN', 'axolotl', 'otter')).toBe(false);
  });

  it.each<Role>([
    'HQ_LEAD',
    'HQ_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_STAFF',
    'CHALLENGER_PM',
    'CHALLENGER',
  ])('%s는 공지를 관리할 수 없다', (role) => {
    expect(canManageNotice(role, 'axolotl', 'axolotl')).toBe(false);
  });
});

describe('getProjectRegisterAccess', () => {
  it.each<[Role, View, ProjectRegisterAccess]>([
    ['SUPER_ADMIN', 'ADMIN', 'ADMIN'],
    ['HQ_LEAD', 'ADMIN', 'ADMIN'],
    ['CHAPTER_ADMIN', 'ADMIN', 'ADMIN'],
    ['HQ_ADMIN', 'ADMIN', 'NONE'],
    ['SCHOOL_ADMIN', 'ADMIN', 'NONE'],
    ['SCHOOL_STAFF', 'ADMIN', 'NONE'],
    ['CHALLENGER_PM', 'ADMIN', 'PM'],
    ['CHALLENGER', 'ADMIN', 'NONE'],
    ['SUPER_ADMIN', 'PM_CHALLENGER', 'PM'],
    ['CHAPTER_ADMIN', 'CHALLENGER', 'NONE'],
  ])('%s의 %s 뷰는 프로젝트 등록 %s', (role, view, expected) => {
    expect(getProjectRegisterAccess(role, view)).toBe(expected);
  });
});
