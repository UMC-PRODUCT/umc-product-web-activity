import type { NoticeSummaryResponse } from '../api/getNotices';
import type { Notice, NoticeKind } from '../model/types';

// 서버는 ISO 시각을 내려줌. 목록에는 한국 날짜(YYYY-MM-DD)로 보여줌
const toDate = (createdAt = '') => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt.slice(0, 10);
  return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
};

// '수달 지부장 윰씨/김유앤' 형태. 역할 · 소속이 없으면 이름만
const toAuthorLabel = ({ author, authorNickname, authorName }: NoticeSummaryResponse) => {
  const nickname = author?.nickname ?? authorNickname;
  const name = author?.name ?? authorName;
  const person = [nickname, name].filter(Boolean).join('/');
  const position = [author?.organizationName, author?.roleName].filter(Boolean).join(' ');
  return [position, person].filter(Boolean).join(' ');
};

// 서버 공지 → 화면 공지. ID는 문자열("6")로 올 수 있어 문자열로 맞춤
export const toNotice = (
  response: NoticeSummaryResponse,
  kind: NoticeKind,
  chapterId: number,
): Notice => ({
  id: String(response.id),
  kind,
  chapterId: String(chapterId),
  title: response.title ?? '',
  content: response.content ?? '',
  createdAt: toDate(response.createdAt),
  required: response.mustRead ?? false,
  authorLabel: toAuthorLabel(response),
});
