import { skipToken, useQuery } from '@tanstack/react-query';

import { getNotices } from '../api/getNotices';
import { noticeKeys } from '../api/queryKeys';
import { toNotice } from '../lib/toNotice';
import type { NoticeKind } from '../model/types';

// 공지 한 번에 가져올 개수. 목록 화면이 10개씩 나눠 보여줌
const NOTICE_FETCH_SIZE = 100;

// 공지 목록 = 해당 기수 · 지부의 챌린저 공지. 기수나 지부를 모르면 부르지 않음
// TODO: 서버 공지에 메뉴 구분이 없어 팀 매칭 · 프로젝트 설정 공지가 같은 목록이다. 구분 필드가 생기면 kind로 거름
export const useChapterNotices = (
  kind: NoticeKind,
  gisuId: number | null,
  chapterId: number | null,
) =>
  useQuery({
    queryKey: noticeKeys.list(gisuId, chapterId),
    queryFn:
      gisuId === null || chapterId === null
        ? skipToken
        : () =>
            getNotices({
              gisuId,
              chapterId,
              noticeTab: 'CHALLENGER',
              page: 0,
              size: NOTICE_FETCH_SIZE,
            }),
    select: (page) =>
      (page.content ?? []).map((notice) => toNotice(notice, kind, chapterId as number)),
  });
