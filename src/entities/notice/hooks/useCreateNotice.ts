import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNotice } from '../api/createNotice';
import { noticeKeys } from '../api/queryKeys';
import { getTargetParts } from '../lib/noticeKindParts';
import type { NoticeInput, NoticeKind } from '../model/types';

type CreateNoticeVariables = {
  kind: NoticeKind;
  gisuId: number;
  chapterIds: number[]; // 지부마다 공지를 하나씩 등록
  input: NoticeInput;
};

// 공지 작성 (챌린저 공지, 선택한 지부마다 한 건씩)
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kind, gisuId, chapterIds, input }: CreateNoticeVariables) =>
      Promise.all(
        chapterIds.map((chapterId) =>
          createNotice({
            title: input.title,
            content: input.content,
            mustRead: input.required,
            shouldNotify: false,
            targetInfo: {
              targetGisuId: gisuId,
              targetChapterId: chapterId,
              targetParts: getTargetParts(kind),
              targetNoticeTab: 'CHALLENGER',
            },
          }),
        ),
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: noticeKeys.all }),
  });
};
