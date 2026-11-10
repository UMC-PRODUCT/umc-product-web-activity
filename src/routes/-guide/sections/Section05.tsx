import { PaginationBar } from '@umc-product/react';
import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import Admin01 from '@/routes/-guide/assets/Section5/Admin/Admin_01.png';
import Admin02 from '@/routes/-guide/assets/Section5/Admin/Admin_02.png';
import Admin03 from '@/routes/-guide/assets/Section5/Admin/Admin_03.png';
import Admin04 from '@/routes/-guide/assets/Section5/Admin/Admin_04.png';
import Admin05 from '@/routes/-guide/assets/Section5/Admin/Admin_05.png';
import Admin06 from '@/routes/-guide/assets/Section5/Admin/Admin_06.png';
import Admin07 from '@/routes/-guide/assets/Section5/Admin/Admin_07.png';
import Admin08 from '@/routes/-guide/assets/Section5/Admin/Admin_08.png';
import Admin09 from '@/routes/-guide/assets/Section5/Admin/Admin_09.png';
import Admin10 from '@/routes/-guide/assets/Section5/Admin/Admin_10.png';
import Admin11 from '@/routes/-guide/assets/Section5/Admin/Admin_11.png';
import Challenger01 from '@/routes/-guide/assets/Section5/Challenger/Challenger_01.png';
import Challenger02 from '@/routes/-guide/assets/Section5/Challenger/Challenger_02.png';
import Challenger03 from '@/routes/-guide/assets/Section5/Challenger/Challenger_03.png';
import Challenger04 from '@/routes/-guide/assets/Section5/Challenger/Challenger_04.png';
import Challenger05 from '@/routes/-guide/assets/Section5/Challenger/Challenger_05.png';
import Challenger06 from '@/routes/-guide/assets/Section5/Challenger/Challenger_06.png';
import Challenger07 from '@/routes/-guide/assets/Section5/Challenger/Challenger_07.png';
import Challenger08 from '@/routes/-guide/assets/Section5/Challenger/Challenger_08.png';
import PM01Mockup from '@/routes/-guide/assets/Section5/PM/PM_01_mockup.png';
import PM02Mockup from '@/routes/-guide/assets/Section5/PM/PM_02_mockup.png';
import PM03Mockup from '@/routes/-guide/assets/Section5/PM/PM_03_mockup.png';
import PM04Mockup from '@/routes/-guide/assets/Section5/PM/PM_04_mockup.png';
import PM05Mockup from '@/routes/-guide/assets/Section5/PM/PM_05_mockup.png';
import PM06Mockup from '@/routes/-guide/assets/Section5/PM/PM_06_mockup.png';
import PM07Mockup from '@/routes/-guide/assets/Section5/PM/PM_07_mockup.png';
import PM08Mockup from '@/routes/-guide/assets/Section5/PM/PM_08_mockup.png';
import PM09Mockup from '@/routes/-guide/assets/Section5/PM/PM_09_mockup.png';
import GuideSegmentControl from '@/routes/-guide/components/GuideSegmentControl';
import type { PmGuideCardData } from '@/routes/-guide/components/PmGuideCard';
import PmGuideCard from '@/routes/-guide/components/PmGuideCard';
import { cn } from '@/shared/lib/cn';

const ALL_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const CHALLENGER_ITEMS = [
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const IMAGE_CONTENT: Record<string, string[]> = {
  admin: [
    Admin01,
    Admin02,
    Admin03,
    Admin04,
    Admin05,
    Admin06,
    Admin07,
    Admin08,
    Admin09,
    Admin10,
    Admin11,
  ],
  challenger: [
    Challenger01,
    Challenger02,
    Challenger03,
    Challenger04,
    Challenger05,
    Challenger06,
    Challenger07,
    Challenger08,
  ],
};

const PM_CARDS: PmGuideCardData[] = [
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

  const isPm = selected === 'pm';
  const totalPages = isPm ? PM_CARDS.length : IMAGE_CONTENT[selected].length;

  return (
    <section className="flex min-w-[1440px] flex-col items-center bg-teal-grey-900 py-[60px]">
      <div className="flex w-[1320px] flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-medium font-semibold text-[#9BE9E0]">
            Guide <span className="text-[#36D3C0]"> | 사용 메뉴얼</span>
          </p>
          <GuideSegmentControl items={items} value={selected} onValueChange={handleTabChange} />
        </div>
        {isPm ? (
          <div className="mt-3 mb-5 w-full">
            <PmGuideCard {...PM_CARDS[currentPage]} />
          </div>
        ) : (
          <div
            className={cn(
              'relative mt-3 mb-5 h-[740px] w-full overflow-hidden rounded-2xl px-10 pt-10',
              currentPage === IMAGE_CONTENT[selected].length - 1 ? 'pb-0' : 'pb-[66px]',
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2ED1BE]/40 to-transparent opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2ED1BE] to-transparent opacity-40" />
            {IMAGE_CONTENT[selected][currentPage] && (
              <img src={IMAGE_CONTENT[selected][currentPage]} alt="" className="relative z-10" />
            )}
          </div>
        )}
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
