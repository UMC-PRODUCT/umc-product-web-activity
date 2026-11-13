import { skipToken, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

import { getApplicationDetail } from '../api/getApplicationDetail';
import { getMyApplications } from '../api/getMyApplications';
import { prepareDraft } from '../api/prepareDraft';
import { applicationKeys } from '../api/queryKeys';
import { type ApplicationAnswerItem, saveApplicationAnswers } from '../api/saveApplicationAnswers';
import { findDraftApplicationId } from '../model/findDraftApplicationId';
import { toAnswerDrafts } from '../model/toAnswerDrafts';

// 입력을 멈추고 이만큼 지나면 자동 저장
const AUTO_SAVE_DELAY = 1_000;

type ApplyDraftTarget = {
  gisuId: number | null;
  projectId: number;
  matchingRoundId: number | null;
};

// 지원서 자동 임시저장
// - 이 프로젝트 · 지원 차수의 임시저장(DRAFT) 지원서가 있으면 그 답변을 initialDrafts로 돌려줌 (지난 차수의 초안은 차수가 달라 불러오지 않음)
// - schedule로 답변을 넘기면 입력이 멈춘 뒤 저장하고, 화면을 벗어나면(언마운트) 남은 답변을 바로 저장함
// - 저장할 초안이 없으면 처음 저장할 때 같은 차수의 다른 프로젝트 초안을 지우고 새로 만듦 (마지막에 쓴 프로젝트 하나만 남음)
// - 자동 저장 실패는 화면에 알리지 않음 (제출할 때 답변을 다시 보냄)
export const useApplyDraft = ({ gisuId, projectId, matchingRoundId }: ApplyDraftTarget) => {
  // 다른 화면에서 받아 둔 목록 · 답변이 남아 있을 수 있어 열 때마다 서버에서 새로 불러옴
  const drafts = useQuery({
    queryKey: applicationKeys.drafts(gisuId),
    queryFn: gisuId === null ? skipToken : () => getMyApplications({ gisuId, status: 'DRAFT' }),
    staleTime: 0,
  });
  const draftId =
    drafts.data && matchingRoundId !== null
      ? findDraftApplicationId(drafts.data, projectId, matchingRoundId)
      : null;
  const detail = useQuery({
    queryKey: applicationKeys.detail(projectId, draftId),
    queryFn:
      draftId === null
        ? skipToken
        : () => getApplicationDetail({ projectId, applicationId: draftId }),
    select: toAnswerDrafts,
    staleTime: 0,
  });

  const isDraftsReady = drafts.isSuccess && !drafts.isFetching && matchingRoundId !== null;
  const isDetailReady = draftId === null || (detail.isSuccess && !detail.isFetching);
  // 초안을 못 불러오면 빈 지원서로 시작
  const isError = drafts.isError || detail.isError;
  const isLoaded = (isDraftsReady && isDetailReady) || isError;

  const applicationIdRef = useRef<number | null>(null);
  const pendingRef = useRef<ApplicationAnswerItem[] | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // 저장 요청이 겹치지 않게 차례로 보냄 (첫 저장의 초안 생성이 끝나야 다음 저장이 같은 지원서를 씀)
  const queueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (draftId !== null) applicationIdRef.current = draftId;
  }, [draftId]);

  const save = useCallback(
    async (answers: ApplicationAnswerItem[]) => {
      if (matchingRoundId === null) return;
      const applicationId =
        applicationIdRef.current ?? (await prepareDraft({ gisuId, projectId, matchingRoundId }));
      applicationIdRef.current = applicationId;
      await saveApplicationAnswers({ projectId, applicationId, answers });
    },
    [gisuId, projectId, matchingRoundId],
  );

  // 기다리던 답변을 바로 저장. 앞선 저장까지 모두 끝나면 끝남
  const flush = useCallback(() => {
    clearTimeout(timerRef.current);
    const answers = pendingRef.current;
    if (answers !== null) {
      pendingRef.current = null;
      queueRef.current = queueRef.current.then(() => save(answers)).catch(() => {});
    }
    return queueRef.current;
  }, [save]);

  const schedule = useCallback(
    (answers: ApplicationAnswerItem[]) => {
      pendingRef.current = answers;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, AUTO_SAVE_DELAY);
    },
    [flush],
  );

  // 쓰다가 화면을 벗어나면 남은 답변을 저장
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);
  useEffect(() => () => void flushRef.current(), []);

  return {
    initialDrafts: detail.data ?? null,
    isLoaded,
    schedule,
    flush,
  };
};
