import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['NOTICE-001'];

export type NoticesQuery = Operation['parameters']['query'];
export type NoticesResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;
export type NoticeSummaryResponse = NonNullable<NoticesResponse['content']>[number];

/** 공지사항 전체 조회 */
export const getNotices = (query: NoticesQuery) =>
  api.get<NoticesResponse>('/api/v1/notices', query);
