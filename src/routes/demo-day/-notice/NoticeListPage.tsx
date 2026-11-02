import { AddIcon } from '@umc-product/icons';
import { Button, PageHeader } from '@umc-product/react';
import { useState } from 'react';

import {
  getHardcodedNotices,
  type Notice,
  NOTICE_TITLE_MAX_LENGTH,
  type NoticeKind,
  useChapterNotices,
  useDeleteNotice,
  useUpdateNotice,
} from '@/entities/notice';
import ServerChapterSelect from '@/features/chapter-select/ui/ServerChapterSelect';
import { NoticeList } from '@/features/notice-list';
import { NoticeEditForm } from '@/features/notice-write';
import { DeleteNoticeDialog } from '@/widgets/dialog';
import { useAppToast } from '@/widgets/toast';

import { NOTICE_PAGE_CONFIG, NOTICE_PAGE_LAYOUT_CLASS } from './config';
import { useNoticeChapters } from './useNoticeChapters';

type NoticeListPageProps = {
  kind: NoticeKind;
  chapter?: string; // 주소로 받은 지부 ID
  onChapterChange: (chapterId: string) => void;
  showControl: boolean; // 지부 선택 + 공지 작성 버튼 영역 (읽기 전용 화면에서는 숨김)
  onWrite: (chapterId: string) => void;
};

// 팀 매칭 · 프로젝트 설정 공지 목록 (서버 연동). 서버 공지 뒤에 프로덕트 팀이 코드로 넣는 기본 공지 3개가 붙는다.
// 권한이 있으면 지부 선택 · 공지 작성 · 수정 · 삭제가 붙는다 (기본 공지는 제외).
const NoticeListPage = ({
  kind,
  chapter,
  onChapterChange,
  showControl,
  onWrite,
}: NoticeListPageProps) => {
  const config = NOTICE_PAGE_CONFIG[kind];
  const toast = useAppToast();
  const { gisuId, chapters, chaptersLoaded, chapterId, canManage } = useNoticeChapters(chapter);
  const { data: serverNotices = [], isError } = useChapterNotices(kind, gisuId, chapterId);
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  const notices = [
    ...serverNotices,
    ...(chapterId === null ? [] : getHardcodedNotices(kind, String(chapterId))),
  ];

  const handleTitleExceed = () =>
    toast.show(`제목은 ${NOTICE_TITLE_MAX_LENGTH}자까지 작성할 수 있어요`, { color: 'error' });

  return (
    <div className={NOTICE_PAGE_LAYOUT_CLASS}>
      <PageHeader breadcrumbs={config.breadcrumbs} title="공지" description={config.description} />
      <div className="flex flex-col gap-6">
        {/* TODO: 안내 화면이 피그마에 나오면 교체 */}
        {gisuId === null && (
          <p role="alert" className="text-body-3-medium text-red-500">
            내 정보에 현재 기수가 없어서 공지를 불러올 수 없어요.
          </p>
        )}
        {chaptersLoaded && chapterId === null && (
          <p role="alert" className="text-body-3-medium text-red-500">
            볼 수 있는 지부가 없어서 공지를 불러올 수 없어요.
          </p>
        )}
        {isError && (
          <p role="alert" className="text-body-3-medium text-red-500">
            공지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {showControl && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ServerChapterSelect
                chapters={chapters}
                value={chapterId}
                onValueChange={(nextChapterId) => {
                  setEditingId(null);
                  onChapterChange(String(nextChapterId));
                }}
              />
            </div>
            {canManage && (
              <Button
                size="sm"
                leadingIcon={<AddIcon size={14} />}
                // 피그마: 지부 선택 줄 높이(46px)에 맞춰 늘어나고, 여백은 왼쪽 12 · 아이콘 간격 8 · 오른쪽 16
                className="gap-2 pr-4 pl-3 [--umc-button-height:46px]"
                onClick={() => chapterId !== null && onWrite(String(chapterId))}
              >
                공지 작성
              </Button>
            )}
          </div>
        )}
        <NoticeList
          key={chapterId}
          notices={notices}
          onEdit={canManage ? (notice) => setEditingId(notice.id) : undefined}
          onDelete={canManage ? setDeleteTarget : undefined}
          editingId={editingId}
          onCancelEdit={() => setEditingId(null)}
          renderEditor={(notice) => (
            <NoticeEditForm
              notice={notice}
              onTitleExceed={handleTitleExceed}
              onSubmit={async (input) => {
                try {
                  await updateNotice.mutateAsync({ noticeId: Number(notice.id), input });
                } catch {
                  toast.show('공지를 수정하지 못했어요. 잠시 후 다시 시도해 주세요', {
                    color: 'error',
                  });
                  throw new Error('update notice failed');
                }
                setEditingId(null);
                toast.show('공지가 수정되었어요', { color: 'neutral' });
              }}
            />
          )}
        />
      </div>

      <DeleteNoticeDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteNotice.mutate(Number(deleteTarget.id), {
            onSuccess: () => toast.showBottom('공지가 삭제되었어요', { color: 'neutral' }),
            onError: () =>
              toast.show('공지를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요', {
                color: 'error',
              }),
          });
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default NoticeListPage;
