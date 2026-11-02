import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['NOTICE-201'];

export type CreateNoticeBody = Operation['requestBody']['content']['application/json'];
export type CreateNoticeResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

/** 공지사항 생성 */
export const createNotice = (body: CreateNoticeBody) =>
  api.post<CreateNoticeResponse>('/api/v1/notices', body);
