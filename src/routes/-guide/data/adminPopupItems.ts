import type { PopupItem } from '@/routes/-guide/components/GuideCard';

export const POPUP_MATCHING_SCHEDULE: PopupItem[] = [
  { number: 1, title: '총괄 / 부총괄', desc: '전체 지부의 매칭 일정을 설정하고 수정할 수 있어요.' },
  {
    number: 2,
    title: '지부장',
    desc: '소속 지부의 매칭 일정만 설정하고 수정할 수 있어요. 다른 지부의 일정은 조회만 가능해요.',
  },
  {
    number: 3,
    title: '중앙운영진',
    desc: '전체 지부의 매칭 일정을 조회할 수 있지만, 설정하거나 수정할 수는 없어요.',
  },
  { number: 4, title: '학교회장단 / 학교운영진', desc: '매칭 차수 설정 화면에 접근할 수 없어요.' },
];

export const POPUP_TO_SETTINGS: PopupItem[] = [
  {
    number: 1,
    title: '총괄 / 부총괄',
    desc: '전체 지부의 프로젝트 모집 인원을 조회하고 설정할 수 있어요.',
  },
  {
    number: 2,
    title: '지부장',
    desc: '전체 지부의 모집 인원을 조회할 수 있으며, 소속 지부의 모집 인원만 설정할 수 있어요.',
  },
  {
    number: 3,
    title: '중앙운영진',
    desc: '전체 지부의 모집 인원을 조회할 수 있지만, 설정하거나 수정할 수는 없어요.',
  },
  {
    number: 4,
    title: '학교회장단 / 학교운영진',
    desc: '프로젝트 TO 설정 화면에 접근할 수 없어요.',
  },
];

export const POPUP_PROJECT_REGISTER: PopupItem[] = [
  { number: 1, title: '총괄 / 부총괄', desc: '전체 지부의 프로젝트를 등록할 수 있어요.' },
  { number: 2, title: '지부장', desc: '소속 지부의 프로젝트만 등록할 수 있어요.' },
  { number: 3, title: '중앙운영진', desc: '프로젝트 등록 화면에 접근할 수 없어요.' },
  { number: 4, title: '학교회장단 / 학교운영진', desc: '프로젝트 등록 화면에 접근할 수 없어요.' },
];

export const POPUP_NOTICE: PopupItem[] = [
  { number: 1, title: '총괄 / 부총괄', desc: '등록된 공지사항을 조회할 수 있어요.' },
  {
    number: 2,
    title: '지부장',
    desc: '소속 지부의 공지를 등록할 수 있으며, 본인이 작성한 공지만 수정하거나 삭제할 수 있어요.',
  },
  { number: 3, title: '중앙운영진', desc: '등록된 공지사항을 조회할 수 있어요.' },
  { number: 4, title: '학교회장단 / 학교운영진', desc: '등록된 공지사항을 조회할 수 있어요.' },
];

export const POPUP_PROJECT_LIST: PopupItem[] = [
  {
    number: 1,
    title: '총괄 / 부총괄',
    desc: '전체 지부의 프로젝트 목록과 상세 정보를 조회할 수 있어요.',
  },
  { number: 2, title: '지부장', desc: '전체 지부의 프로젝트 목록과 상세 정보를 조회할 수 있어요.' },
  {
    number: 3,
    title: '중앙운영진',
    desc: '전체 지부의 프로젝트 목록과 상세 정보를 조회할 수 있어요.',
  },
  {
    number: 4,
    title: '학교회장단 / 학교운영진',
    desc: '전체 지부의 프로젝트 목록과 상세 정보를 조회할 수 있어요.',
  },
];

export const POPUP_APPLICATION: PopupItem[] = [
  {
    number: 1,
    title: '총괄 / 부총괄',
    desc: '전체 지부의 지원자 목록을 조회할 수 있어요. 지원서 열람과 합격, 불합격, 대기 판정은 해당 차수의 매칭 기간에만 가능해요.',
  },
  {
    number: 2,
    title: '지부장',
    desc: '소속 지부의 지원자 목록을 조회하고, 해당 차수의 매칭 기간에만 지원서를 열람할 수 있어요. 단, 합격, 불합격, 대기 판정은 불가능해요.',
  },
  {
    number: 3,
    title: '중앙운영진',
    desc: '전체 지부의 지원 현황을 조회할 수 있어요. 단, 개별 지원서 열람과 합격, 불합격, 대기 판정은 불가능해요.',
  },
  {
    number: 4,
    title: '학교회장단 / 학교운영진',
    desc: '소속 지부의 지원 현황만 확인할 수 있어요. 지원자 목록과 개별 지원서는 열람할 수 없어요.',
  },
];

export const POPUP_MATCHING_PERIOD: PopupItem[] = [
  { number: 1, title: '1차 지원 시작부터 1차 결정 마감까지' },
  { number: 2, title: '1차 결과 공개 후부터 2차 결정 마감까지' },
  { number: 3, title: '2차 결과 공개 후부터 3차 결정 마감까지' },
  { number: 4, title: '랜덤 매칭 실행 완료 후 조정 시작부터 조정 종료까지' },
];

export const POPUP_MATCHING_PERIOD_CHIP = '수동 배정과 매칭 해제는 아래 기간에만 가능해요.';
export const POPUP_MATCHING_PERIOD_BG =
  'linear-gradient(-33deg, rgba(54,211,192,0.5) 2.8%, rgb(0,0,0) 97.7%), linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%)';

export const POPUP_MATCHING: PopupItem[] = [
  {
    number: 1,
    title: '총괄 / 부총괄',
    desc: '전체 지부의 매칭 현황을 조회하고, 허용된 기간에 모든 지부의 매칭을 해제하거나 팀원을 수동으로 배정할 수 있어요.',
  },
  {
    number: 2,
    title: '지부장',
    desc: '전체 지부의 매칭 현황을 조회할 수 있어요. 단, 매칭 해제와 수동 배정은 허용된 기간에 소속 지부의 프로젝트에 한해서만 가능해요.',
  },
  {
    number: 3,
    title: '중앙운영진',
    desc: '전체 지부의 매칭 현황을 조회할 수 있어요. 단, 수동 배정과 매칭 해제는 불가능해요.',
  },
  {
    number: 4,
    title: '학교회장단 / 학교운영진',
    desc: '전체 지부의 매칭 현황을 조회할 수 있어요. 단, 수동 배정과 매칭 해제는 불가능해요.',
  },
];
