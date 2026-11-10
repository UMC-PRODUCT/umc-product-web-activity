import { PaginationBar } from '@umc-product/react';
import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import Admin01Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_01_mockup.png';
import Admin02Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_02_mockup.png';
import Admin03Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_03_mockup.png';
import Admin04Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_04_mockup.png';
import Admin05Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_05_mockup.png';
import Admin06Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_06_mockup.png';
import Admin07Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_07_mockup.png';
import Admin08Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_08_mockup.png';
import Admin09Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_09_mockup.png';
import Admin10Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_10_mockup.png';
import Admin11Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_11_mockup.png';
import Admin12Mockup from '@/routes/-guide/assets/Section5/Admin/Admin_12_mockup.png';
import Challenger01Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_01_mockup.png';
import Challenger02Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_02_mockup.png';
import Challenger03Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_03_mockup.png';
import Challenger04Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_04_mockup.png';
import Challenger05Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_05_mockup.png';
import Challenger06Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_06_mockup.png';
import Challenger07Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_07_mockup.png';
import Challenger08Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_08_mockup.png';
import PM01Mockup from '@/routes/-guide/assets/Section5/PM/PM_01_mockup.png';
import PM02Mockup from '@/routes/-guide/assets/Section5/PM/PM_02_mockup.png';
import PM03Mockup from '@/routes/-guide/assets/Section5/PM/PM_03_mockup.png';
import PM04Mockup from '@/routes/-guide/assets/Section5/PM/PM_04_mockup.png';
import PM05Mockup from '@/routes/-guide/assets/Section5/PM/PM_05_mockup.png';
import PM06Mockup from '@/routes/-guide/assets/Section5/PM/PM_06_mockup.png';
import PM07Mockup from '@/routes/-guide/assets/Section5/PM/PM_07_mockup.png';
import PM08Mockup from '@/routes/-guide/assets/Section5/PM/PM_08_mockup.png';
import PM09Mockup from '@/routes/-guide/assets/Section5/PM/PM_09_mockup.png';
import type { GuideCardData } from '@/routes/-guide/components/GuideCard';
import GuideCard from '@/routes/-guide/components/GuideCard';
import GuideSegmentControl from '@/routes/-guide/components/GuideSegmentControl';

const ALL_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const CHALLENGER_ITEMS = [
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const ADMIN_CARDS: GuideCardData[] = [
  {
    chip: '매칭 차수 설정',
    step: '# 1-1 매칭 차수 설정',
    title: '지부별 매칭 일정을 설정하고 관리해요.',
    body: '전체 매칭 시작일과 결과 발표 시각을 입력하면 지원 기간, 매칭 기간, 랜덤 매칭 기간이 자동으로 계산돼요.',
    mockupSrc: Admin01Mockup,
    items: [
      {
        number: 1,
        title: '전체 매칭 일정 설정',
        desc: '전체 매칭 시작일을 입력하면 각 차수의 지원 기간과 매칭 기간, 랜덤 매칭 기간이 자동으로 계산돼요.',
      },
      {
        number: 2,
        title: '매칭 결과 발표 시각 설정',
        desc: '각 차수의 매칭 결과가 공개될 시각을 설정해요. 설정한 시각에 맞춰 매칭 결과가 일괄 공개돼요.',
      },
      {
        number: 3,
        title: '지원 기간 확인',
        desc: '챌린저들이 프로젝트에 지원할 수 있는 기간이에요. 해당 차수의 지원 기간에만 지원서를 제출하거나 수정하고, 지원을 취소할 수 있어요.',
      },
    ],
  },
  {
    chip: '매칭 차수 설정',
    step: '# 1-1 매칭 차수 설정',
    title: '지부별 매칭 일정을 설정하고 관리해요.',
    body: '전체 매칭 시작일과 결과 발표 시각을 입력하면 지원 기간, 매칭 기간, 랜덤 매칭 기간이 자동으로 계산돼요.',
    mockupSrc: Admin02Mockup,
    items: [
      {
        number: 1,
        title: '전체 매칭 일정 설정',
        desc: '전체 매칭 시작일을 입력하면 각 차수의 지원 기간과 매칭 기간, 랜덤 매칭 기간이 자동으로 계산돼요.',
      },
      {
        number: 2,
        title: '매칭 결과 발표 시각 설정',
        desc: '각 차수의 매칭 결과가 공개될 시각을 설정해요. 설정한 시각에 맞춰 매칭 결과가 일괄 공개돼요.',
      },
      {
        number: 3,
        title: '지원 기간 확인',
        desc: '챌린저들이 프로젝트에 지원할 수 있는 기간이에요. 해당 차수의 지원 기간에만 지원서를 제출하거나 수정하고, 지원을 취소할 수 있어요.',
      },
    ],
  },
  {
    chip: '프로젝트 TO 설정',
    step: '# 2-1 프로젝트 모집 인원 설정',
    title: '지부별 프로젝트의 모집 인원을 한눈에 확인하고 설정해요.',
    body: '각 프로젝트의 모집 인원을 하나의 표에서 설정하고, 파트별 배정 가능 인원을 한눈에 확인할 수 있어요.',
    mockupSrc: Admin03Mockup,
    items: [
      {
        number: 1,
        title: '지부별 모집 현황 확인',
        desc: '지부별 파트의 배정 가능 인원과 프로젝트별 모집 현황을 한눈에 확인해요.',
      },
      {
        number: 2,
        title: '프로젝트별 TO 설정',
        desc: '하나의 표에서 프로젝트별 Design 및 Product Engineering 모집 인원을 설정해요. Product Engineering은 Web PE와 Mobile PE 중 하나를 선택할 수 있어요.',
      },
      {
        number: 3,
        title: '모집 인원 일괄 관리',
        desc: '여러 프로젝트의 모집 인원을 한 화면에서 통합 관리해요.',
      },
      {
        number: 4,
        title: '배정 가능 인원 검증',
        desc: '배정 가능 인원보다 적게 설정하면 안내 메시지 확인 후 저장할 수 있으며, 초과하면 저장할 수 없어요.',
      },
    ],
  },
  {
    chip: '프로젝트 관리',
    step: '# 3-1 프로젝트 정보 확인 및 관리',
    title: '지부별 프로젝트 정보를 확인하고 관리해요.',
    body: '프로젝트의 기본 정보와 승인 상태를 확인하고, 필요한 경우 정보를 수정하거나 삭제할 수 있어요.',
    mockupSrc: Admin04Mockup,
    items: [
      {
        number: 1,
        title: '프로젝트 관리 목록 확인',
        desc: '프로젝트 관리 목록에서 각 프로젝트의 기본 정보와 현재 상태를 확인해요.',
      },
      {
        number: 2,
        title: '프로젝트 정보 수정 및 삭제',
        desc: '기존 프로젝트의 정보를 수정하거나 삭제할 수 있어요. 단, 프로젝트 수정 및 삭제는 매칭 기간에만 가능해요.',
      },
      {
        number: 3,
        title: '프로젝트 상태 확인 및 승인',
        desc: '프로젝트의 승인 대기, 등록 완료 상태를 확인하고 프로젝트를 승인할 수 있어요.',
      },
    ],
  },
  {
    chip: '기본 정보',
    step: '# 4-1 프로젝트 등록',
    title: '새로운 프로젝트를 등록하고 팀 매칭에 필요한 정보를 입력해요.',
    body: '프로젝트 한 줄 소개, 썸네일, 로고, 기획 문서 링크를 준비해 주세요.',
    mockupSrc: Admin05Mockup,
    items: [
      {
        number: 1,
        title: '프로젝트 카드',
        desc: '대표 썸네일(648×324px)와 프로젝트 한 줄 소개를 설정해요.',
      },
      {
        number: 2,
        title: '로고',
        desc: '매칭 시 챌린저들에게 보여질 프로젝트 로고를 등록해요.',
      },
      {
        number: 3,
        title: '기획 문서',
        desc: '지원자들이 프로젝트를 깊이 이해할 수 있도록 기획 문서 링크를 첨부해요.',
      },
      {
        number: 4,
        title: '모집 정보',
        desc: '프로젝트에 필요한 기술 스택과 파트별 모집 인원을 확인해요. 모집 인원은 프로젝트 TO 설정 화면에서 관리할 수 있어요.',
      },
    ],
  },
  {
    chip: '지원 문항',
    step: '# 4-2 프로젝트 등록',
    title: '프로젝트 지원자들에게 물어볼 질문을 작성해요.',
    body: '모든 지원자를 위한 공통 문항과 파트별 문항을 나눠 설정할 수 있어요.',
    mockupSrc: Admin06Mockup,
    items: [
      {
        number: 1,
        title: '공통 문항',
        desc: '모든 지원자를 위한 공통 문항을 작성해요. 미리 설정된 기본 문항은 수정하거나 삭제할 수 없어요.',
      },
      {
        number: 2,
        title: '파트별 문항',
        desc: 'Design, Product Engineering 각 파트 지원자를 위한 문항을 작성해요.',
      },
      {
        number: 3,
        title: '질문 유형 설정',
        desc: '주관식, 단일 선택, 복수 선택, 파일 업로드, 포트폴리오 총 5가지 질문 유형을 설정할 수 있어요. 필요한 경우 기존 문항을 복사해 사용할 수도 있어요.',
      },
    ],
    note: '지원자에게는 본인이 지원하는 파트에 해당하는 문항만 보여요.',
  },
  {
    chip: '공지 관리',
    step: '# 5-1 공지 확인 및 관리',
    title: '챌린저들에게 필요한 공지사항을 등록하고 관리해요.',
    body: '관리자 권한에 따라 공지사항을 조회하거나 등록, 수정 및 삭제할 수 있어요.',
    mockupSrc: Admin07Mockup,
    items: [
      {
        number: 1,
        title: '공지 목록 확인',
        desc: '등록된 공지사항을 조회하고 프로젝트 설정 및 팀 매칭과 관련된 주요 안내를 확인해요.',
      },
      {
        number: 2,
        title: '공지 등록',
        desc: '공지 제목과 내용을 작성해 챌린저들에게 필요한 안내사항을 등록해요.',
      },
      {
        number: 3,
        title: '공지 수정 및 삭제',
        desc: '기존에 작성한 공지사항을 수정하거나 삭제할 수 있어요.',
      },
    ],
  },
  {
    chip: '프로젝트 목록',
    step: '# 6-1 프로젝트 목록 확인',
    title: '모든 지부에 등록된 프로젝트를 한눈에 확인해요.',
    body: '프로젝트별 모집 정보와 현재 팀원 구성을 확인하고, 검색 및 필터 기능을 통해 원하는 프로젝트를 찾아볼 수 있어요.',
    mockupSrc: Admin08Mockup,
    items: [
      {
        number: 1,
        title: '전체 프로젝트 조회',
        desc: '모든 지부에 등록된 프로젝트의 기본 정보와 모집 현황을 한눈에 확인해요.',
      },
      {
        number: 2,
        title: '검색 및 필터',
        desc: '지부, PM 학교, 파트, 모집 상태별로 원하는 프로젝트를 빠르게 찾아요. 프로젝트 이름을 직접 검색할 수도 있어요.',
      },
      {
        number: 3,
        title: '프로젝트 상세 확인',
        desc: '프로젝트 카드를 클릭하면 프로젝트 소개, 모집 인원과 상태, 현재 팀원 구성을 확인할 수 있어요. 기획 문서도 열람할 수 있어요.',
      },
    ],
  },
  {
    chip: '지원 현황',
    step: '# 7-1 지원 현황 확인',
    title: '프로젝트별 지원 현황과 지원자 정보를 확인해요.',
    body: '관리자 권한에 따라 지원 현황을 조회하고, 해당 차수의 매칭 기간에 지원서를 열람하거나 선발 결과를 관리할 수 있어요.',
    mockupSrc: Admin09Mockup,
    items: [
      {
        number: 1,
        title: '지원자 목록 확인',
        desc: '프로젝트별로 누가 지원했는지 확인하고, 지원자의 현재 상태를 파악해요.',
      },
      {
        number: 2,
        title: '검색 및 필터',
        desc: '학교, 파트, 차수, 모집 상태별로 원하는 조건의 지원자를 빠르게 찾아요.',
      },
      {
        number: 3,
        title: '지원서 조회',
        desc: '지원자 이름을 클릭해 작성한 답변과 제출 파일을 확인할 수 있어요.',
      },
      {
        number: 4,
        title: '합격 및 불합격 판정',
        desc: '지원서를 검토한 후 합격, 불합격, 대기 상태를 지정할 수 있어요. 해당 차수의 매칭 기간이 종료되면 선발 결과를 변경할 수 없어요.',
      },
    ],
  },
  {
    chip: '전체 매칭 현황',
    step: '# 8-1 매칭 현황 확인',
    title: '모든 지부의 매칭 현황을 확인하고 팀원 배정을 관리해요.',
    body: '지부별 매칭 통계와 프로젝트별 매칭 결과를 확인하고, 관리자 권한에 따라 팀원을 수동 배정하거나 매칭을 해제할 수 있어요.',
    mockupSrc: Admin10Mockup,
    items: [
      {
        number: 1,
        title: '매칭 통계 확인',
        desc: '지부별 매칭 완료율, 학교별 매칭 완료율, 프로젝트별 매칭 현황을 한눈에 파악해요.',
      },
      {
        number: 2,
        title: '매칭 결과 시트',
        desc: '각 프로젝트에 배정된 팀원과 소속 파트를 확인해요. 1차, 2차, 3차 및 랜덤 매칭 결과를 구분해 조회할 수 있어요.',
      },
      {
        number: 3,
        title: '수동 배정',
        desc: '프로젝트별 팀원 구성을 확인하고, 필요한 경우 특정 챌린저를 원하는 프로젝트에 수동으로 배정할 수 있어요.',
      },
      {
        number: 4,
        title: '매칭 해제',
        desc: '이미 배정된 팀원의 매칭을 해제하고 프로젝트의 팀원 구성을 조정할 수 있어요.',
      },
    ],
  },
  {
    chip: '전체 매칭 현황',
    step: '# 8-1 매칭 현황 확인',
    title: '모든 지부의 매칭 현황을 확인하고 팀원 배정을 관리해요.',
    body: '지부별 매칭 통계와 프로젝트별 매칭 결과를 확인하고, 관리자 권한에 따라 팀원을 수동 배정하거나 매칭을 해제할 수 있어요.',
    mockupSrc: Admin11Mockup,
    items: [
      {
        number: 1,
        title: '매칭 통계 확인',
        desc: '지부별 매칭 완료율, 학교별 매칭 완료율, 프로젝트별 매칭 현황을 한눈에 파악해요.',
      },
      {
        number: 2,
        title: '매칭 결과 시트',
        desc: '각 프로젝트에 배정된 팀원과 소속 파트를 확인해요. 1차, 2차, 3차 및 랜덤 매칭 결과를 구분해 조회할 수 있어요.',
      },
      {
        number: 3,
        title: '수동 배정',
        desc: '프로젝트별 팀원 구성을 확인하고, 필요한 경우 특정 챌린저를 원하는 프로젝트에 수동으로 배정할 수 있어요.',
      },
      {
        number: 4,
        title: '매칭 해제',
        desc: '이미 배정된 팀원의 매칭을 해제하고 프로젝트의 팀원 구성을 조정할 수 있어요.',
      },
    ],
  },
  {
    chip: '사용자 만족도 조사',
    step: '# 9 사용자 만족도 조사',
    title: '서비스 이용 경험을 자유롭게 공유해요.',
    body: '더 나은 서비스를 위해 많은 참여 부탁드려요!',
    mockupSrc: Admin12Mockup,
    items: [
      {
        title: '서비스 경험',
        desc: '매칭 과정에서 불편했던 점이나 좋았던 점을 자유롭게 남겨주세요. 더 나은 서비스를 만드는 데 큰 힘이 되니 많은 참여 부탁드려요!',
      },
    ],
  },
];

const PM_CARDS: GuideCardData[] = [
  {
    chip: '기본정보',
    step: '# 1-1 프로젝트 등록',
    title: 'Plan 챌린저는 매칭 기간 전에 미리 프로젝트를 등록해요.',
    body: '프로젝트 한 줄 소개, 배너, 로고, 기획 문서 링크를 준비해 주세요.',
    mockupSrc: PM01Mockup,
    items: [
      {
        number: 1,
        title: '프로젝트 카드',
        desc: '대표 썸네일(648*324px)과 한 줄 소개를 설정해요.',
      },
      { number: 2, title: '로고', desc: '매칭 시 챌린저들에게 보여질 프로젝트 로고를 등록해요.' },
      {
        number: 3,
        title: '기획 문서',
        desc: '지원자들이 프로젝트를 잘 이해할 수 있도록 기획 문서 링크를 첨부해요.',
      },
      {
        number: 4,
        title: '모집 정보',
        desc: '프로젝트에 필요한 기술 스택과 파트별 모집 인원은 운영진이 설정해요.',
      },
    ],
  },
  {
    chip: '지원 문항',
    step: '# 1-2 프로젝트 등록',
    title: '지원자들에게 물어볼 질문을 작성해요',
    body: '공통 질문과 파트별 질문을 나눠 작성할 수 있어요',
    mockupSrc: PM02Mockup,
    items: [
      { number: 1, title: '공통 문항', desc: '모든 지원자들을 위한 공통 문항을 작성해요.' },
      {
        number: 2,
        title: '파트별 문항',
        desc: 'Design, FE, BE 각 파트 지원자들을 위한 문항을 작성해요.',
      },
      {
        number: 3,
        title: '질문 유형 설정',
        desc: '주관식, 장문형, 단일 선택, 복수 선택, 파일 업로드, 포트폴리오 총 6가지 질문 유형을 설정할 수 있어요.',
      },
    ],
  },
  {
    chip: '프로젝트 관리',
    step: '# 2 프로젝트 정보 확인 및 수정',
    title: '등록한 프로젝트의 정보와 모집 조건을 확인하고 수정해요.',
    body: '프로젝트 정보는 전체 매칭 시작 전과 각 차수의 매칭 기간에 수정할 수 있어요.',
    mockupSrc: PM03Mockup,
    items: [
      {
        number: 1,
        title: '프로젝트 정보 확인',
        desc: '등록한 프로젝트의 기본 정보와 모집 정보를 확인해요.',
      },
      {
        number: 2,
        title: '프로젝트 정보 수정',
        desc: '프로젝트 소개, 썸네일, 로고, 기획 문서 등 등록한 정보를 수정해요.',
      },
      {
        number: 3,
        title: '지원 문항 수정',
        desc: '공통 문항과 파트별 문항을 확인하고 필요한 내용을 수정해요.',
      },
    ],
    note: '지원 기간에는 지원자에게 안내된 모집 조건이 변경되어 혼란이나 불이익이 발생하지 않도록 프로젝트 정보 수정이 제한돼요.',
  },
  {
    chip: '프로젝트 목록',
    step: '# 3 프로젝트 목록 확인',
    title: '모든 지부에 등록된 프로젝트를 살펴보고 모집 현황을 확인해요.',
    body: '프로젝트별 모집 정보와 팀원 구성을 확인할 수 있어요.',
    mockupSrc: PM04Mockup,
    items: [
      {
        number: 1,
        title: '프로젝트 목록',
        desc: '모든 지부에 등록된 프로젝트를 한눈에 조회해요.',
      },
      {
        number: 2,
        title: '검색 및 필터',
        desc: '지부, PM 학교, 파트, 모집 상태별로 원하는 프로젝트를 빠르게 찾아요. 프로젝트 이름을 직접 검색할 수 있어요.',
      },
      {
        number: 3,
        title: '프로젝트 상세 확인',
        desc: '프로젝트 카드를 클릭하면 프로젝트 소개, 모집 인원과 상태, 현재 팀원 구성, 기획 문서도 열람할 수 있어요.',
      },
    ],
  },
  {
    chip: '공지 및 문의사항',
    step: '# 4 공지 확인 및 문의하기',
    title: '공지사항을 확인하고 필요한 내용을 문의해요.',
    body: '등록된 공지사항을 읽고, 서비스 이용 중 문제가 발생하면 문의할 수 있어요.',
    mockupSrc: PM05Mockup,
    items: [
      {
        number: 1,
        title: '공지사항 확인',
        desc: '등록된 공지사항을 조회하고 프로젝트 설정 및 팀 매칭과 관련된 주요 안내를 확인해요.',
      },
      {
        number: 2,
        title: '문의하기',
        desc: '화면 우측 상단의 [문의사항] 버튼을 통해 서비스 이용 중 발생한 오류나 문제를 문의할 수 있어요.',
      },
    ],
  },
  {
    chip: '지원 현황',
    step: '# 5-1 지원 현황 확인',
    title: '내 프로젝트에 지원한 챌린저들의 현황을 확인해요.',
    body: '지원 기간에는 지원자 목록을 실시간으로 확인할 수 있으며, 매칭 기간부터 지원서를 열람할 수 있어요.',
    mockupSrc: PM06Mockup,
    items: [
      {
        number: 1,
        title: '지원자 목록',
        desc: '지원 기간에도 내 프로젝트에 누가 지원했는지 실시간으로 확인할 수 있어요. 단, 지원서 내용은 매칭 기간부터 열람할 수 있어요.',
      },
      {
        number: 2,
        title: '검색 및 필터',
        desc: '학교, 파트, 차수, 모집 상태별로 원하는 조건의 지원자를 찾아요.',
      },
      {
        number: 3,
        title: '지원서 조회',
        desc: '매칭 기간이 시작되면 지원자 목록을 클릭해 작성한 답변과 제출 파일을 확인할 수 있어요.',
      },
    ],
  },
  {
    chip: '지원자 선발',
    step: '# 5-2 지원자 선발',
    title: '지원서를 검토하고 프로젝트에 함께할 팀원을 선발해요.',
    body: '해당 차수의 매칭 기간에만 지원자의 합격, 불합격, 대기 상태를 변경할 수 있어요.',
    mockupSrc: PM07Mockup,
    items: [
      {
        number: 1,
        title: '합격 처리',
        desc: '지원서를 검토한 후 함께할 팀원으로 선발할 지원자를 합격 처리해요.',
      },
      {
        number: 2,
        title: '불합격 및 대기 처리',
        desc: '선발하지 않을 지원자는 불합격, 추가 검토가 필요한 지원자는 대기 상태로 설정해요.',
      },
      {
        number: 3,
        title: '선발 결과 변경',
        desc: '해당 차수의 매칭 기간에는 지원자의 상태를 자유롭게 변경할 수 있어요. 단, 매칭 기간이 종료되면 결정을 변경할 수 없어요.',
      },
    ],
  },
  {
    chip: '매칭 현황',
    step: '# 6 매칭 현황 확인',
    title: '모든 지부의 매칭 현황을 확인해요.',
    body: '지부별 매칭 통계와 매칭 결과 시트를 통해 프로젝트별 팀원 구성을 확인할 수 있어요.',
    mockupSrc: PM08Mockup,
    items: [
      {
        number: 1,
        title: '매칭 통계',
        desc: '지부별 매칭 완료율, 학교별 매칭 완료율, 프로젝트별 매칭 현황을 파악해요.',
      },
      {
        number: 2,
        title: '매칭 결과 시트',
        desc: '각 프로젝트에 배정된 팀원을 조회해요. 모든 지부의 매칭 결과도 확인할 수 있어요.',
      },
    ],
  },
  {
    chip: '사용자 만족도 조사',
    step: '# 7 사용자 만족도 조사',
    title: '서비스 이용 경험을 자유롭게 공유해요.',
    body: '더 나은 서비스를 위해 많은 참여 부탁드려요!',
    mockupSrc: PM09Mockup,
    items: [
      {
        title: '서비스 경험',
        desc: '매칭 과정에서 불편했던 점이나 좋았던 점을 자유롭게 남겨주세요. 더 나은 서비스를 만드는 데 큰 힘이 되니 많은 참여 부탁드려요!',
      },
    ],
  },
];

const CHALLENGER_CARDS: GuideCardData[] = [
  {
    chip: '프로젝트 목록',
    step: '# 1-1 프로젝트 목록 확인',
    title: '등록된 프로젝트를 살펴보고 지원할 프로젝트를 찾아봐요.',
    body: '모든 지부의 프로젝트를 조회할 수 있어요. 단, 프로젝트 지원은 본인이 소속된 지부에서만 가능해요.',
    mockupSrc: Challenger01Mockup,
    items: [
      { number: 1, title: '프로젝트 목록', desc: '모든 지부의 프로젝트를 한눈에 확인해요.' },
      {
        number: 2,
        title: '검색 및 필터',
        desc: '지부, PM 학교, 파트, 모집 상태별로 원하는 프로젝트를 빠르게 찾아요. 프로젝트 이름을 직접 검색할 수 있어요.',
      },
      {
        number: 3,
        title: '모집 상태 확인',
        desc: '프로젝트별 모집 인원과 모집 상태를 확인해요. 특히 Product Engineering 챌린저는 웹과 모바일 파트를 구분해 본인이 지원할 수 있는지 확인해요.',
      },
    ],
  },
  {
    chip: '프로젝트 카드',
    step: '# 1-2 프로젝트 상세 확인',
    title: '프로젝트 카드를 클릭해 더 자세한 내용을 확인해요.',
    body: '팀원 구성과 기획안을 확인한 후 원하는 프로젝트에 지원할 수 있어요.',
    mockupSrc: Challenger02Mockup,
    items: [
      { number: 1, title: '기획 보기', desc: 'PM이 작성한 기획 문서로 이동해요.' },
      { number: 2, title: '지원하기', desc: '지원서 작성 화면으로 이동해요.' },
      { number: 3, title: '팀원 구성 확인', desc: '현재 프로젝트에 소속된 팀원 구성을 확인해요.' },
    ],
  },
  {
    chip: '지원하기',
    step: '# 2 프로젝트 지원하기',
    title: '원하는 프로젝트의 지원서를 작성하고 제출해요.',
    body: '해당 차수의 지원 기간에만 지원서를 제출하거나 수정하고, 지원을 취소할 수 있어요.',
    mockupSrc: Challenger03Mockup,
    items: [
      {
        number: 1,
        title: '지원 문항 작성',
        desc: '공통 문항과 지원 파트에 맞게 구성된 문항에 답변을 작성해요.',
      },
      {
        number: 2,
        title: '지원서 제출',
        desc: '모든 문항의 답변을 작성한 후 지원서를 제출해요. 제출한 지원서는 내 지원 현황에서 확인할 수 있어요.',
      },
    ],
    note: '임시저장 기능은 제공되지 않으니, 답변을 미리 준비한 후 작성해 주세요.',
  },
  {
    chip: '프로젝트 목록',
    step: '# 3 프로젝트 목록 확인',
    title: '등록된 프로젝트의 모집 현황과 팀원 구성을 확인해요.',
    body: '다양한 프로젝트의 정보를 살펴보고 관심 있는 프로젝트를 자세히 확인할 수 있어요.',
    mockupSrc: Challenger04Mockup,
    items: [
      {
        number: 1,
        title: '프로젝트 목록',
        desc: '모든 지부에 등록된 프로젝트를 한눈에 조회해요.',
      },
      {
        number: 2,
        title: '검색 및 필터',
        desc: '지부, PM 학교, 파트, 모집 상태별로 프로젝트를 찾아요. 프로젝트 이름을 직접 검색할 수도 있어요.',
      },
      {
        number: 3,
        title: '프로젝트 상세 확인',
        desc: '프로젝트 카드를 클릭하면 프로젝트 소개, 기획 문서, 모집 인원과 상태, 현재 팀원 구성을 확인할 수 있어요.',
      },
    ],
  },
  {
    chip: '공지 및 문의사항',
    step: '# 4 공지 확인 및 문의하기',
    title: '공지사항을 확인하고 필요한 내용을 문의해요.',
    body: '등록된 공지사항을 읽고, 서비스 이용 중 문제가 발생하면 문의할 수 있어요.',
    mockupSrc: Challenger05Mockup,
    items: [
      {
        number: 1,
        title: '공지사항 확인',
        desc: '등록된 공지사항을 조회하고 팀 매칭과 관련된 주요 안내를 확인해요.',
      },
      {
        number: 2,
        title: '문의하기',
        desc: '화면 우측 상단의 문의하기 버튼을 통해 서비스 이용 중 발생한 오류나 문제를 문의할 수 있어요.',
      },
    ],
  },
  {
    chip: '지원 현황',
    step: '# 5-1 지원 현황 확인',
    title: '나의 프로젝트 지원 현황을 확인해요.',
    body: '각 차수별 지원 내역과 매칭 결과를 확인할 수 있어요.',
    mockupSrc: Challenger06Mockup,
    items: [
      {
        number: 1,
        title: '지원 현황',
        desc: '매칭 차수별로 어떤 프로젝트에 지원했는지 조회해요. 합격 여부는 매칭 결과가 공개된 후 확인할 수 있어요.',
      },
      {
        number: 2,
        title: '내 지원서 보기',
        desc: '내가 작성한 지원서를 확인해요. 해당 차수의 지원 기간에는 지원서를 수정하거나 지원을 취소할 수 있어요.',
      },
    ],
    note: '해당 차수의 지원 기간이 종료되면 지원서 수정과 지원 취소가 불가능해요.',
  },
  {
    chip: '매칭 현황',
    step: '# 6 매칭 현황 확인',
    title: '모든 지부의 매칭 현황을 확인해요.',
    body: '지부별 매칭 통계와 매칭 결과 시트를 볼 수 있어요.',
    mockupSrc: Challenger07Mockup,
    items: [
      {
        number: 1,
        title: '매칭 통계',
        desc: '지부별 매칭 완료율, 학교별 매칭 완료율, 프로젝트별 매칭 현황을 파악해요.',
      },
      {
        number: 2,
        title: '매칭 결과 시트',
        desc: '각 프로젝트에 배정된 팀원을 조회해요. 모든 지부의 매칭 결과도 확인할 수 있어요.',
      },
    ],
  },
  {
    chip: '사용자 만족도 조사',
    step: '# 7 사용자 만족도 조사',
    title: '서비스 이용 경험을 자유롭게 공유해요.',
    body: '더 나은 서비스를 위해 많은 참여 부탁드려요!',
    mockupSrc: Challenger08Mockup,
    items: [
      {
        title: '서비스 경험',
        desc: '매칭 과정에서 불편했던 점이나 좋았던 점을 자유롭게 남겨주세요. 더 나은 서비스를 만드는 데 큰 힘이 되니 많은 참여 부탁드려요!',
      },
    ],
  },
];

const GUIDE_CARDS: Record<string, GuideCardData[]> = {
  admin: ADMIN_CARDS,
  pm: PM_CARDS,
  challenger: CHALLENGER_CARDS,
};

const Section05 = () => {
  const role = useSessionStore((state) => state.session.role);
  const isAdmin = role !== 'CHALLENGER_PM' && role !== 'CHALLENGER';
  const items = isAdmin ? ALL_ITEMS : CHALLENGER_ITEMS;

  const [selected, setSelected] = useState(items[0].value);
  const [currentPage, setCurrentPage] = useState(0);

  const handleTabChange = (value: string) => {
    setSelected(value);
    setCurrentPage(0);
  };

  const guideCards = GUIDE_CARDS[selected];
  const totalPages = guideCards.length;

  return (
    <section className="flex min-w-[1440px] flex-col items-center bg-teal-grey-900 py-[60px]">
      <div className="flex w-[1320px] flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-medium font-semibold text-[#9BE9E0]">
            Guide <span className="text-[#36D3C0]"> | 사용 메뉴얼</span>
          </p>
          <GuideSegmentControl items={items} value={selected} onValueChange={handleTabChange} />
        </div>
        <div className="mt-3 mb-5 w-full">
          <GuideCard {...guideCards[currentPage]} isAdmin={selected === 'admin'} />
        </div>
        <PaginationBar
          totalPages={totalPages}
          page={currentPage + 1}
          onPageChange={(page: number) => setCurrentPage(page - 1)}
          highlightNext
        />
      </div>
    </section>
  );
};

export default Section05;
