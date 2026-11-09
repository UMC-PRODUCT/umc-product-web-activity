import { NOTICE_CONTENTS } from './noticeContents';
import type { Notice, NoticeKind } from './types';

const PRODUCT_AUTHOR = 'UMC PRODUCT';

const CHAPTER_NOTICE_TITLE: Record<NoticeKind, string> = {
  TEAM_MATCHING: '팀 매칭 안내 사항',
  PROJECT_SETTINGS: '프로젝트 등록 안내사항',
};

// 피그마: 메뉴마다 하드코딩된 공지 문구가 조금 다르다
const HARDCODED_TITLES: Record<NoticeKind, [string, string]> = {
  TEAM_MATCHING: ['자주 질문하는 내용', '서비스 이용 및 문의사항, 버그제보안내'],
  PROJECT_SETTINGS: ['자주 질문하는 내용', '서비스 이용 및 문의사항, 버그 제보 안내'],
};

// 프로덕트 팀이 코드로 넣는 기본 공지 3개. 서버 공지와 상관없이 항상 목록에 붙는다 (수정·삭제 불가)
export const getHardcodedNotices = (kind: NoticeKind, chapterId: string): Notice[] => {
  const idPrefix = `${kind}-${chapterId}`;
  const [faqTitle, guideTitle] = HARDCODED_TITLES[kind];
  const contents = NOTICE_CONTENTS[kind];

  return [
    {
      id: `${idPrefix}-chapter`,
      kind,
      chapterId,
      title: CHAPTER_NOTICE_TITLE[kind],
      content: contents.guide,
      createdAt: '2026-11-10',
      required: true,
      authorLabel: PRODUCT_AUTHOR,
      hardcoded: true,
    },
    {
      id: `${idPrefix}-faq`,
      kind,
      chapterId,
      title: faqTitle,
      content: contents.faq,
      createdAt: '2026-11-10',
      required: false,
      authorLabel: PRODUCT_AUTHOR,
      hardcoded: true,
    },
    {
      id: `${idPrefix}-service-guide`,
      kind,
      chapterId,
      title: guideTitle,
      content: contents.serviceGuide,
      createdAt: '2026-11-10',
      required: false,
      authorLabel: PRODUCT_AUTHOR,
      hardcoded: true,
    },
  ];
};
