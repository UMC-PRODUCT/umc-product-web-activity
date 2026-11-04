import type { MyInfoResponse } from '@/entities/session';

import { getProfileGisuIds, toProfileMenu } from './toProfileMenu';

// 서버는 ID를 문자열로 줌
const MY_INFO = {
  name: '박은솔',
  nickname: '솔',
  schoolName: '가천대학교',
  profileImageLink: '',
  currentGisuMemberInfo: { gisuId: '8' },
  challengerHistory: [
    { gisuId: '6', generation: 10, chapterName: '아홀로틀' },
    { gisuId: '8', generation: 11, chapterName: '티라노' },
  ],
} as unknown as MyInfoResponse;

describe('toProfileMenu', () => {
  it('프로필과 역할 태그를 만들고, 사진이 없으면 기본 그림을 쓴다', () => {
    expect(toProfileMenu(MY_INFO, 'CHAPTER_ADMIN').profile).toEqual({
      nickname: '솔',
      name: '박은솔',
      school: '가천대학교',
      role: { label: '지부장', color: 'chapter' },
      imageSrc: undefined,
    });
  });

  it.each([
    ['SUPER_ADMIN', [], 'Admin', 'challenger-super-admin'],
    ['HQ_LEAD', ['CENTRAL_PRESIDENT'], '총괄', 'central'],
    ['HQ_LEAD', ['CENTRAL_VICE_PRESIDENT'], '부총괄', 'central'],
    ['HQ_ADMIN', ['CENTRAL_OPERATING_TEAM_MEMBER'], '중앙 운영진', 'central'],
    ['CHAPTER_ADMIN', ['CHAPTER_PRESIDENT'], '지부장', 'chapter'],
    ['SCHOOL_ADMIN', ['SCHOOL_PRESIDENT'], '교내 회장', 'campus'],
    ['SCHOOL_ADMIN', ['SCHOOL_VICE_PRESIDENT'], '교내 부회장', 'campus'],
    ['SCHOOL_STAFF', ['SCHOOL_PART_LEADER'], '교내 운영진', 'campus'],
    ['CHALLENGER_PM', [], '챌린저', 'challenger-super-admin'],
    ['CHALLENGER', [], '챌린저', 'challenger-super-admin'],
  ] as const)('%s %j의 역할 태그는 %s다', (role, roleTypes, label, color) => {
    const myInfo = {
      ...MY_INFO,
      currentGisuMemberInfo: { gisuId: '8', roleTypes },
    } as unknown as MyInfoResponse;

    expect(toProfileMenu(myInfo, role).profile.role).toEqual({ label, color });
  });

  it('기수를 최신순으로 두고 현재 기수만 고를 수 있다', () => {
    const { generations, generation } = toProfileMenu(MY_INFO, 'CHALLENGER');

    expect(generation).toBe('8');
    expect(generations).toEqual([
      { value: '8', label: '11기', disabled: false },
      { value: '6', label: '10기', disabled: true },
    ]);
  });

  it('기수 오른쪽에 연도를 보여 주고, 연도를 모르는 기수는 비워 둔다', () => {
    const { generations } = toProfileMenu(MY_INFO, 'CHALLENGER', new Map([[8, '2026']]));

    expect(generations).toEqual([
      { value: '8', label: '11기', caption: '2026', disabled: false },
      { value: '6', label: '10기', disabled: true },
    ]);
  });

  it('연도를 조회할 기수 ID에 이력과 현재 기수를 모두 넣는다', () => {
    const myInfo = {
      ...MY_INFO,
      currentGisuMemberInfo: { gisuId: '8', generation: 11 },
      challengerHistory: [{ gisuId: '6', generation: 10 }],
    } as unknown as MyInfoResponse;

    expect(getProfileGisuIds(myInfo)).toEqual([6, 8]);
    expect(getProfileGisuIds(MY_INFO)).toEqual([6, 8]);
  });

  it('챌린저 이력이 없으면 현재 기수를 채운다', () => {
    const myInfo = {
      ...MY_INFO,
      currentGisuMemberInfo: { gisuId: '8', generation: 11 },
      challengerHistory: [],
    } as unknown as MyInfoResponse;

    const { generations, generation } = toProfileMenu(myInfo, 'SUPER_ADMIN');

    expect(generation).toBe('8');
    expect(generations).toEqual([{ value: '8', label: '11기', disabled: false }]);
  });

  it('이력에 현재 기수가 없으면 지난 기수 앞에 채운다', () => {
    const myInfo = {
      ...MY_INFO,
      currentGisuMemberInfo: { gisuId: '8', generation: 11 },
      challengerHistory: [{ gisuId: '6', generation: 10, chapterName: '아홀로틀' }],
    } as unknown as MyInfoResponse;

    expect(toProfileMenu(myInfo, 'CHAPTER_ADMIN').generations).toEqual([
      { value: '8', label: '11기', disabled: false },
      { value: '6', label: '10기', disabled: true },
    ]);
  });

  it('현재 기수도 이력도 없으면 기수 목록이 비어 있다', () => {
    const myInfo = {
      ...MY_INFO,
      currentGisuMemberInfo: null,
      challengerHistory: [],
    } as unknown as MyInfoResponse;

    expect(toProfileMenu(myInfo, 'SUPER_ADMIN').generations).toEqual([]);
  });
});
