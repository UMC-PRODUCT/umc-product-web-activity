import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['NOTICE-202'];

export type DeleteNoticePath = Operation['parameters']['path'];

/** 공지사항 삭제 */
export const deleteNotice = ({ noticeId }: DeleteNoticePath) =>
  api.delete<void>(`/api/v1/notices/${noticeId}`);
