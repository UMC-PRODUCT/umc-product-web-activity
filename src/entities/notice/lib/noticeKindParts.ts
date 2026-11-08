import type { NoticeSummaryResponse } from '../api/getNotices';
import type { NoticeKind } from '../model/types';

type TargetParts = NonNullable<NoticeSummaryResponse['targetInfo']>['targetParts'];

// 서버 공지에 메뉴 구분이 없어, 프로젝트 설정 공지는 기존 UPMS처럼 대상 파트를 PLAN으로 두어 구분함
const PROJECT_SETTINGS_PARTS = ['PLAN'] as const;

// 공지 작성 때 보낼 대상 파트. 팀 매칭 공지는 파트 구분 없이 전체
export const getTargetParts = (kind: NoticeKind): TargetParts =>
  kind === 'PROJECT_SETTINGS' ? [...PROJECT_SETTINGS_PARTS] : undefined;

// 서버 공지가 어느 메뉴 공지인지. 대상 파트가 PLAN뿐이면 프로젝트 설정, 그 외는 팀 매칭
export const getNoticeKind = (targetParts: TargetParts): NoticeKind =>
  targetParts?.length === 1 && targetParts[0] === 'PLAN' ? 'PROJECT_SETTINGS' : 'TEAM_MATCHING';
