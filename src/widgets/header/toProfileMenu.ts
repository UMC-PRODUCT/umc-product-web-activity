import type {
  HeaderProfileMenuGeneration,
  HeaderProfileMenuProfile,
  HeaderProfileMenuRole,
} from '@umc-product/react';

import { type MyInfoResponse, type Role } from '@/entities/session';
import { toId } from '@/shared/api/toId';
import { formatSchoolName } from '@/shared/lib/formatSchoolName';

// 피그마 Web/Header/Profile Menu의 역할 태그
const ROLE_TAG: Record<Role, HeaderProfileMenuRole> = {
  SUPER_ADMIN: { label: 'Admin', color: 'challenger-super-admin' },
  HQ_LEAD: { label: '총괄', color: 'central' },
  HQ_ADMIN: { label: '중앙 운영진', color: 'central' },
  CHAPTER_ADMIN: { label: '지부장', color: 'chapter' },
  SCHOOL_ADMIN: { label: '교내 회장', color: 'campus' },
  SCHOOL_STAFF: { label: '교내 운영진', color: 'campus' },
  CHALLENGER_PM: { label: '챌린저', color: 'challenger-super-admin' },
  CHALLENGER: { label: '챌린저', color: 'challenger-super-admin' },
};

// 화면 역할은 회장 · 부회장을 묶어서 다루므로, 부회장 태그는 서버 역할로 구분
// UMC PRODUCT 멤버는 다른 역할이 있어도 Product 태그를 보여 줌
const getRoleTag = (myInfo: MyInfoResponse, role: Role): HeaderProfileMenuRole => {
  // U+FE0F가 없으면 톱니가 흑백 글리프로 나와서, 시안처럼 컬러 이모지로 고정
  if (myInfo.isUmcProduct) return { label: '⚙️ Product', color: 'product' };
  const roleTypes = myInfo.currentGisuMemberInfo?.roleTypes ?? [];
  if (role === 'HQ_LEAD' && !roleTypes.includes('CENTRAL_PRESIDENT')) {
    return { label: '부총괄', color: 'central' };
  }
  if (role === 'SCHOOL_ADMIN' && !roleTypes.includes('SCHOOL_PRESIDENT')) {
    return { label: '교내 부회장', color: 'campus' };
  }
  return ROLE_TAG[role];
};

export const UNREGISTERED_GENERATION_VALUE = 'UNREGISTERED';

const UNREGISTERED_GENERATION: HeaderProfileMenuGeneration = {
  value: UNREGISTERED_GENERATION_VALUE,
  label: '챌린저 코드 미등록',
};

const isChallengerCodeUnregistered = (myInfo: MyInfoResponse) =>
  toId(myInfo.currentGisuMemberInfo?.gisuId) === null &&
  !myInfo.isSuperAdmin &&
  !myInfo.isUmcProduct;

export type ProfileMenu = {
  profile: HeaderProfileMenuProfile;
  generations: HeaderProfileMenuGeneration[];
  generation: string | undefined;
};

// 메뉴에 보여 줄 기수 기록. 챌린저 이력이 없는 운영진도 현재 기수는 보이도록, 이력에 없으면 현재 기수 정보로 채움
const getGenerationRecords = (myInfo: MyInfoResponse) => {
  const current = myInfo.currentGisuMemberInfo;
  const currentGisuId = toId(current?.gisuId);
  const history = myInfo.challengerHistory ?? [];
  return currentGisuId === null || history.some(({ gisuId }) => toId(gisuId) === currentGisuId)
    ? history
    : [...history, { gisuId: current?.gisuId, generation: current?.generation }];
};

// 메뉴에 보여 줄 기수 ID (연도를 조회할 때 씀)
export const getProfileGisuIds = (myInfo: MyInfoResponse) =>
  getGenerationRecords(myInfo).flatMap(({ gisuId }) => {
    const id = toId(gisuId);
    return id === null ? [] : [id];
  });

// 내 정보 → 헤더 프로필 메뉴. 기수는 활동한 기수 목록이고, 기수 전환은 아직 없어 현재 기수만 고를 수 있음
// 기수 오른쪽 연도는 따로 조회하므로, 불러오기 전이나 실패했을 때는 비어 있음
export const toProfileMenu = (
  myInfo: MyInfoResponse,
  role: Role,
  gisuYears?: Map<number, string>,
): ProfileMenu => {
  const currentGisuId = toId(myInfo.currentGisuMemberInfo?.gisuId);
  const generations = getGenerationRecords(myInfo)
    .flatMap(({ gisuId, generation }) => {
      const id = toId(gisuId);
      return id === null
        ? []
        : [
            {
              value: String(id),
              label: `${generation ?? '-'}기`,
              caption: gisuYears?.get(id),
              disabled: id !== currentGisuId,
              generation: generation ?? 0,
            },
          ];
    })
    .sort((left, right) => right.generation - left.generation)
    .map(({ generation: _generation, ...item }) => item);

  const profile: HeaderProfileMenuProfile = {
    nickname: myInfo.nickname ?? '-',
    name: myInfo.name ?? '-',
    school: formatSchoolName(myInfo.schoolName),
    role: getRoleTag(myInfo, role),
    imageSrc: myInfo.profileImageLink || undefined,
  };

  if (isChallengerCodeUnregistered(myInfo)) {
    return {
      profile,
      generations: [UNREGISTERED_GENERATION, ...generations],
      generation: UNREGISTERED_GENERATION.value,
    };
  }

  return {
    profile,
    generations,
    generation: currentGisuId === null ? undefined : String(currentGisuId),
  };
};
