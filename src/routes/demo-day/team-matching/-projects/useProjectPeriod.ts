import { useState } from 'react';

import type { Session, View } from '@/entities/session';
import {
  getMatchingStepFromRounds,
  type MatchingStep,
  useMatchingRounds,
} from '@/features/matching-schedule';
import type { ProjectPeriod, ProjectViewer } from '@/features/project-list';

type Track = ProjectPeriod['track'];

// 서버 매칭 차수의 type (서버는 PE를 DEVELOPER로 부름)
const SERVER_TYPE: Record<Track, 'PLAN_DESIGN' | 'PLAN_DEVELOPER'> = {
  DESIGN: 'PLAN_DESIGN',
  PE: 'PLAN_DEVELOPER',
};

// 일반 챌린저는 본인 파트의 트랙 일정을 따름 (Design → Plan-Design, PE → Plan-PE)
const getChallengerTrack = ({ challengerPart }: ProjectViewer): Track | null => {
  if (challengerPart === null) return null;
  return challengerPart === 'DESIGN' ? 'DESIGN' : 'PE';
};

// 지금 시각과 소속 지부의 매칭 일정으로 프로젝트 목록 화면이 따를 기간을 계산
// - 서버 매칭 차수의 시작 · 종료 시각으로 판단 (프로젝트 관리 페이지와 같은 기준)
// - 운영진 뷰에서 프로젝트를 선택했으면 그 프로젝트 지부의 일정을 따름
// - 챌린저는 본인 트랙, 운영진 · PM은 지원 기간인 트랙 → 진행 중인 트랙 → Design 순으로 따름
// - 시작 전 · 일정을 아직 정하지 않은 지부는 프로젝트 등록 기간, 모두 끝남 · 일정을 알 수 없음(소속 지부 없음 · 불러오는 중)은 지원할 수 없는 매칭 기간으로 취급
export const useProjectPeriod = (
  session: Pick<Session, 'serverChapterId'>,
  view: View,
  viewer: ProjectViewer,
  projectChapterId?: number, // 운영진 뷰에서 선택한 프로젝트의 지부 (없으면 내 소속 지부)
): ProjectPeriod => {
  const [now] = useState(() => new Date());
  const { data: rounds } = useMatchingRounds(
    projectChapterId ?? session.serverChapterId ?? undefined,
  );

  const stepOf = (track: Track): MatchingStep | null => {
    if (!rounds) return null;
    // 일정을 아직 정하지 않은 지부는 1차 지원이 시작 전이므로 등록 기간
    return (
      getMatchingStepFromRounds(
        rounds.filter(({ type }) => type === SERVER_TYPE[track]),
        now,
      ) ?? { status: 'BEFORE_START' }
    );
  };

  const isApplying = (track: Track) => {
    const step = stepOf(track);
    return step?.status === 'ONGOING' && step.phase === 'APPLY';
  };
  const isOngoing = (track: Track) => stepOf(track)?.status === 'ONGOING';

  const adminTrack: Track = isApplying('PE')
    ? 'PE'
    : isApplying('DESIGN')
      ? 'DESIGN'
      : isOngoing('PE')
        ? 'PE'
        : 'DESIGN';
  const track: Track = (view === 'CHALLENGER' ? getChallengerTrack(viewer) : null) ?? adminTrack;

  const step = stepOf(track);
  if (step?.status === 'ONGOING') return { track, phase: step.phase, round: step.round };
  if (step?.status === 'BEFORE_START') return { track, phase: 'REGISTER', round: 1 };
  return { track, phase: 'MATCHING', round: step?.status === 'ENDED' ? 3 : 1 };
};
