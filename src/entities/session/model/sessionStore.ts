import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
  canEditApplicantStatus,
  canManageMatching,
  canManageNotice,
  getApplicationsView,
  getMatchingScheduleAccess,
  getProjectRegisterAccess,
  getProjectSettingsAccess,
  getViewOptions,
} from '../lib/access';
import type { Session, View } from './types';

// 루트 라우트에서 내 정보를 불러와 채우기 전 값 (가장 낮은 권한)
const INITIAL_SESSION: Session = {
  role: 'CHALLENGER',
  challengerType: null,
  chapterId: null,
  serverChapterId: null,
  memberId: null,
  gisuId: null,
};

type SessionState = {
  session: Session;
  view: View;
  setSession: (session: Session) => void;
  setView: (view: View) => void;
};

const viewStorageKey = (memberId: number) => `umc-activity:view:${memberId}`;

const readSavedView = (session: Session): View => {
  if (session.memberId === null) return 'ADMIN';
  try {
    const saved = localStorage.getItem(viewStorageKey(session.memberId));
    return getViewOptions(session).some(({ value }) => value === saved) ? (saved as View) : 'ADMIN';
  } catch {
    return 'ADMIN';
  }
};

const saveView = (memberId: number | null, view: View) => {
  if (memberId === null) return;
  try {
    localStorage.setItem(viewStorageKey(memberId), view);
  } catch {
    return;
  }
};

export const useSessionStore = create<SessionState>()((set, get) => ({
  session: INITIAL_SESSION,
  view: 'ADMIN',
  setSession: (session) => set({ session, view: readSavedView(session) }),
  setView: (view) => {
    saveView(get().session.memberId, view);
    set({ view });
  },
}));

export const useProjectSettingsAccess = () =>
  useSessionStore((state) => getProjectSettingsAccess(state.session.role, state.view));

// 프로젝트 등록 페이지 접근 수준 (중앙운영은 조회만이라 NONE)
export const useProjectRegisterAccess = () =>
  useSessionStore((state) => getProjectRegisterAccess(state.session.role, state.view));

export const useApplicationsView = () =>
  useSessionStore((state) => getApplicationsView(state.session.role, state.view));

// 공지는 서버 지부 ID를 문자열로 다룸 (주소 · 공지 저장소 키)
const toNoticeChapterId = (serverChapterId: number | null) =>
  serverChapterId === null ? null : String(serverChapterId);

// 운영진 뷰에서 해당 지부의 공지를 작성·수정·삭제할 수 있는지
export const useCanManageNotice = (chapterId: string) =>
  useSessionStore(
    (state) =>
      getApplicationsView(state.session.role, state.view) === 'ADMIN' &&
      canManageNotice(
        state.session.role,
        toNoticeChapterId(state.session.serverChapterId),
        chapterId,
      ),
  );

export const getCanManageNoticeSnapshot = (chapterId: string) => {
  const { session, view } = useSessionStore.getState();
  return (
    getApplicationsView(session.role, view) === 'ADMIN' &&
    canManageNotice(session.role, toNoticeChapterId(session.serverChapterId), chapterId)
  );
};
// 지원자 배정 상태를 바꿀 수 있는 역할인지 (매칭 기간은 따로 확인)
export const useCanEditApplicantStatus = (projectChapterId: string | null) =>
  useSessionStore((state) =>
    canEditApplicantStatus(
      state.session,
      getApplicationsView(state.session.role, state.view),
      projectChapterId,
    ),
  );

// 매칭 결과를 수동 배정 · 해제할 수 있는 역할인지 (최종 결과 발표 여부는 따로 확인)
export const useCanManageMatching = (projectChapterId: string | null) =>
  useSessionStore((state) => canManageMatching(state.session, state.view, projectChapterId));

// 매칭 차수 설정에서 고를 수 있는 지부 범위 · 일정 수정 가능 여부 (1차 매칭 시작 여부는 따로 확인)
export const useMatchingScheduleAccess = () =>
  useSessionStore(useShallow((state) => getMatchingScheduleAccess(state.session.role)));

// 라우트 beforeLoad처럼 React 밖에서 권한을 확인할 때 사용
export const getProjectRegisterAccessSnapshot = () => {
  const { session, view } = useSessionStore.getState();
  return getProjectRegisterAccess(session.role, view);
};

export const getProjectSettingsAccessSnapshot = () => {
  const { session, view } = useSessionStore.getState();
  return getProjectSettingsAccess(session.role, view);
};
