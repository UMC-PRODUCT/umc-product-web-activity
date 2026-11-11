import Challenger01Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_01_mockup.png';
import Challenger02Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_02_mockup.png';
import Challenger03Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_03_mockup.png';
import Challenger04Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_04_mockup.png';
import Challenger05Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_05_mockup.png';
import Challenger06Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_06_mockup.png';
import Challenger07Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_07_mockup.png';
import Challenger08Mockup from '@/routes/-guide/assets/Section5/Challenger/Challenger_08_mockup.png';
import type { GuideCardData } from '@/routes/-guide/components/GuideCard';

export const CHALLENGER_CARDS: GuideCardData[] = [
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
