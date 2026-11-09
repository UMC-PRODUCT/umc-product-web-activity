import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteNotice } from '../api/deleteNotice';
import { noticeKeys } from '../api/queryKeys';

// 공지 삭제
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteNotice({ noticeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noticeKeys.all }),
  });
};
