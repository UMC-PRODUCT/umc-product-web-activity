import { skipToken, useQuery } from '@tanstack/react-query';

import { getNotices } from '../api/getNotices';
import { noticeKeys } from '../api/queryKeys';
import { toUpmsNoticeType } from '../lib/noticeKindParts';
import { toNotice } from '../lib/toNotice';
import type { NoticeKind } from '../model/types';

// 공지 한 번에 가져올 개수. 목록 화면이 10개씩 나눠 보여줌
const NOTICE_FETCH_SIZE = 100;

// 공지 목록 = 해당 기수 · 지부의 챌린저 공지 중 kind 메뉴(upmsNoticeType)의 것. 기수나 지부를 모르면 부르지 않음
export const useChapterNotices = (
  kind: NoticeKind,
  gisuId: number | null,
  chapterId: number | null,
) =>
  useQuery({
    queryKey: noticeKeys.list(kind, gisuId, chapterId),
    queryFn:
      gisuId === null || chapterId === null
        ? skipToken
        : () =>
            getNotices({
              gisuId,
              chapterId,
              noticeTab: 'CHALLENGER',
              upmsNoticeType: toUpmsNoticeType(kind),
              page: 0,
              size: NOTICE_FETCH_SIZE,
            }),
    select: (page) =>
      (page.content ?? []).map((notice) => toNotice(notice, kind, chapterId as number)),
  });
