import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['NOTICE-203'];

export type UpdateNoticePath = Operation['parameters']['path'];
export type UpdateNoticeBody = Operation['requestBody']['content']['application/json'];

/** 공지사항 수정 (제목 · 본문 · 필독 여부) */
export const updateNotice = ({ noticeId }: UpdateNoticePath, body: UpdateNoticeBody) =>
  api.patch<void>(`/api/v1/notices/${noticeId}`, body);
