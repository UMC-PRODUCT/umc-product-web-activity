import type { CreateNoticeBody } from '../api/createNotice';
import type { NoticeKind } from '../model/types';

type UpmsNoticeType = NonNullable<CreateNoticeBody['upmsNoticeType']>;

// 서버의 UPMS 공지 유형. 공지 작성 본문과 목록 조회 쿼리에 같은 값을 보낸다
const UPMS_NOTICE_TYPES: Record<NoticeKind, UpmsNoticeType> = {
  TEAM_MATCHING: 'TEAM_MATCHING',
  PROJECT_SETTINGS: 'PROJECT_SETTING',
};

export const toUpmsNoticeType = (kind: NoticeKind): UpmsNoticeType => UPMS_NOTICE_TYPES[kind];
