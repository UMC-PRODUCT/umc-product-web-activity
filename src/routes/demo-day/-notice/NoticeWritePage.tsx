import { PageHeader } from '@umc-product/react';

import { NOTICE_TITLE_MAX_LENGTH, type NoticeKind, useCreateNotice } from '@/entities/notice';
import { NoticeWriteForm } from '@/features/notice-write';
import { useAppToast } from '@/widgets/toast';

import { NOTICE_PAGE_CONFIG, NOTICE_PAGE_LAYOUT_CLASS } from './config';
import { useNoticeChapters } from './useNoticeChapters';

type NoticeWritePageProps = {
  kind: NoticeKind;
  chapter?: string; // 처음 선택되어 있는 지부 ID
  onComplete: (chapterId: string) => void; // 등록한 뒤 목록으로
};

// 팀 매칭 · 프로젝트 설정 공지 작성 (서버 연동). 총괄단 이상은 여러 지부에 한 번에 등록하고, 지부장은 본인 지부가 정해져 있다.
const NoticeWritePage = ({ kind, chapter, onComplete }: NoticeWritePageProps) => {
  const config = NOTICE_PAGE_CONFIG[kind];
  const toast = useAppToast();
  const { gisuId, chapters, chapterId } = useNoticeChapters(chapter);
  const createNotice = useCreateNotice();

  // 기수나 지부를 알기 전에는 폼을 그리지 않음 (처음 선택된 지부를 폼이 한 번만 읽기 때문)
  if (gisuId === null || chapterId === null) return null;

  return (
    <div className={NOTICE_PAGE_LAYOUT_CLASS}>
      <PageHeader
        breadcrumbs={config.breadcrumbs}
        title="공지 작성"
        description={config.writeDescription}
      />
      <NoticeWriteForm
        chapters={chapters.map(({ id, name }) => ({ id: String(id), name }))}
        initialChapterIds={[String(chapterId)]}
        onTitleExceed={() =>
          toast.show(`제목은 ${NOTICE_TITLE_MAX_LENGTH}자까지 작성할 수 있어요`, { color: 'error' })
        }
        onSubmit={async (input, chapterIds) => {
          try {
            await createNotice.mutateAsync({
              gisuId,
              chapterIds: chapterIds.map(Number),
              input,
            });
          } catch {
            toast.show('공지를 등록하지 못했어요. 잠시 후 다시 시도해 주세요', { color: 'error' });
            throw new Error('create notice failed');
          }
          toast.show('공지가 등록되었어요', { color: 'neutral' });
          onComplete(chapterIds[0] ?? String(chapterId));
        }}
      />
    </div>
  );
};

export default NoticeWritePage;
