import type { Role, Session, View } from '@/entities/session';

import type { Project, ProjectPeriod, ProjectViewer } from './types';

export type ProjectActionKind = 'RECRUIT_QUESTIONS' | 'EDIT_PROJECT' | 'APPLY' | 'MY_APPLICATION';

export type ProjectAction = {
  kind: ProjectActionKind;
  label: string;
  disabled: boolean;
  notice: string | null; // 버튼이 비활성인 이유 (버튼 아래 안내 문구)
};

export type ProjectActions = {
  // 기획보기 옆 주 버튼. 없으면 기획보기만 보임
  primary: ProjectAction | null;
  showTeamButton: boolean; // 팀원 구성 보기
};

export const NOTICE_NOT_APPLY_PERIOD = '지금은 프로젝트 지원 기간이 아니에요';
export const NOTICE_PART_MISMATCH = '해당 프로젝트는 모집 파트가 달라 지원할 수 없어요';
export const NOTICE_RECRUIT_CLOSED = '모집이 마감된 프로젝트예요';
export const NOTICE_ALREADY_APPLIED = '이미 다른 프로젝트에 지원했어요';

const enabled = (kind: ProjectActionKind, label: string): ProjectAction => ({
  kind,
  label,
  disabled: false,
  notice: null,
});

const disabled = (kind: ProjectActionKind, label: string, notice: string): ProjectAction => ({
  kind,
  label,
  disabled: true,
  notice,
});

type GetProjectActionsParams = {
  role: Role;
  chapterId: Session['chapterId']; // 로그인한 사용자의 소속 지부
  view: View;
  project: Project;
  period: ProjectPeriod;
  viewer: ProjectViewer;
};

// 운영진 뷰(모든 어드민 동일): 등록 · 지원 기간에는 모집 문항 보기, 매칭 기간에는 비활성 + 지원 기간 아님 안내 (피그마)
const getAdminPrimaryAction = ({ period }: GetProjectActionsParams): ProjectAction =>
  period.phase === 'MATCHING'
    ? disabled('RECRUIT_QUESTIONS', '모집 문항 보기', NOTICE_NOT_APPLY_PERIOD)
    : enabled('RECRUIT_QUESTIONS', '모집 문항 보기');

// PM 뷰: 지원 기간에는 모집 문항 보기, 그 외에는 본인 프로젝트만 수정하기. PM은 지원 기간에 수정할 수 없음
const getPmPrimaryAction = ({
  project,
  period,
  viewer,
}: GetProjectActionsParams): ProjectAction => {
  const canEdit = viewer.myProjectId === project.projectId;

  if (period.phase === 'APPLY') return enabled('RECRUIT_QUESTIONS', '모집 문항 보기');
  if (canEdit) return enabled('EDIT_PROJECT', '프로젝트 수정하기');
  return disabled('RECRUIT_QUESTIONS', '모집 문항 보기', NOTICE_NOT_APPLY_PERIOD);
};

// 일반 챌린저 뷰: 본인 지부 프로젝트에만 지원하기 · 내 지원서 보기가 나옴 (그 외는 기획보기만)
// 안내 문구 우선순위: 모집 마감 > 모집 파트 불일치 > 이미 다른 프로젝트에 지원 > 지원 기간 아님
const getChallengerPrimaryAction = ({
  chapterId,
  project,
  period,
  viewer,
}: GetProjectActionsParams): ProjectAction | null => {
  // 프로젝트 지부를 모르면(null) 막지 않음. 지원 가능 여부는 서버가 최종 판단
  if (chapterId === null || (project.chapterId !== null && chapterId !== project.chapterId)) {
    return null;
  }
  if (viewer.isMatched) return null;

  // 지원한 프로젝트의 지원서는 매칭 기간에도 열람 가능 (수정은 지원 기간에만, 내 지원 현황에서 막음)
  if (viewer.appliedProjectId === project.projectId) {
    return enabled('MY_APPLICATION', '내 지원서 보기');
  }

  const myPart = project.recruitments.find(({ part }) => part === viewer.challengerPart);
  const isProjectClosed = project.recruitments.every(({ status }) => status === 'CLOSED');

  if (isProjectClosed) return disabled('APPLY', '지원하기', NOTICE_RECRUIT_CLOSED);
  if (!myPart) return disabled('APPLY', '지원하기', NOTICE_PART_MISMATCH);
  if (myPart.status === 'CLOSED') return disabled('APPLY', '지원하기', NOTICE_RECRUIT_CLOSED);
  if (viewer.appliedProjectId !== null) {
    return disabled('APPLY', '지원하기', NOTICE_ALREADY_APPLIED);
  }
  if (period.phase !== 'APPLY') return disabled('APPLY', '지원하기', NOTICE_NOT_APPLY_PERIOD);
  return enabled('APPLY', '지원하기');
};

// 피그마 프로젝트 상세 모달: 권한 · 기간 · 지원 상태에 따라 하단 버튼이 달라짐
export const getProjectActions = (params: GetProjectActionsParams): ProjectActions => ({
  primary:
    params.view === 'CHALLENGER'
      ? getChallengerPrimaryAction(params)
      : params.view === 'ADMIN'
        ? getAdminPrimaryAction(params)
        : getPmPrimaryAction(params),
  // 피그마 상세 카드에는 항상 있음. 매칭 기간에도 전 차수 결과를 유지하다가 결과 발표 시 함께 갱신되고,
  // 매칭된 팀원이 아직 없으면 팀원 구성 패널이 "매칭이 진행 중이에요"로 안내함
  showTeamButton: true,
});
