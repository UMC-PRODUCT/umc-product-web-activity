import { useMutation, useQueryClient } from '@tanstack/react-query';

import { noticeKeys } from '../api/queryKeys';
import { updateNotice } from '../api/updateNotice';
import type { NoticeInput } from '../model/types';

type UpdateNoticeVariables = {
  noticeId: number;
  input: NoticeInput;
};

// 공지 수정 (제목 · 본문 · 필독 여부)
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noticeId, input }: UpdateNoticeVariables) =>
      updateNotice(
        { noticeId },
        { title: input.title, content: input.content, mustRead: input.required },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noticeKeys.all }),
  });
};
