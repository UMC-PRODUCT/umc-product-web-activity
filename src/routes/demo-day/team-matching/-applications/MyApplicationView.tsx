import { useQuery } from '@tanstack/react-query';
import { Button, FormHeader, FormSheet, ImageThumbnail } from '@umc-product/react';
import { useState } from 'react';

import {
  type AnswerDrafts,
  type AppliedProject,
  getVisibleRecruitments,
  isSectionsComplete,
  RecruitmentList,
  type RecruitPart,
  toAnswerItems,
  useApplicationDetail,
  useEditApplication,
} from '@/features/applications';
import { getApplicationForm } from '@/features/project-register/api/applicationForm';
import { ApplicationForm } from '@/widgets/application';
import { useAppToast } from '@/widgets/toast';

import EditApplicationSections from './EditApplicationSections';

// 지원서 머리는 PE를 플랫폼 이름으로만 표기
const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web',
  MOBILE_PE: 'Mobile',
};

type MyApplicationViewProps = {
  project: AppliedProject;
  applicationId: number;
  logoUrl: string | null; // 프로젝트 상세에서 불러옴 (불러오기 전이면 기본 로고)
  description: string; // 프로젝트 소개 (불러오기 전이면 빈 문자열)
  isCanceling: boolean; // 지원 취소 요청 중
  onCancelClick: () => void; // 지원 취소 경고창 열기
};

// 피그마 내 지원서 보기 (Web/Form/Sheet): 탭 모양 프로젝트 라벨(Form/Header) + 프로젝트 요약 + 제출한 지원서
const MyApplicationView = ({
  project,
  applicationId,
  logoUrl,
  description,
  isCanceling,
  onCancelClick,
}: MyApplicationViewProps) => {
  const target = { projectId: project.projectId, applicationId };
  const application = useApplicationDetail(target);
  const form = useQuery({
    queryKey: ['application-form', project.projectId],
    queryFn: () => getApplicationForm(project.projectId),
    enabled: project.applicationEditable,
  });
  const edit = useEditApplication(project.applicationEditable ? target : null, form.data?.sections);
  const toast = useAppToast();
  const [drafts, setDrafts] = useState<AnswerDrafts | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = drafts !== null;

  const startEdit = () => {
    if (edit.initialDrafts) setDrafts(edit.initialDrafts);
  };

  const handleSave = () => {
    if (!drafts || !edit.sections) return;
    edit.save.mutate(toAnswerItems(edit.sections, drafts), {
      onSuccess: () => {
        setDrafts(null);
        toast.show('지원서를 수정했어요.');
      },
      onError: (error) => toast.show(error.message, { color: 'error' }),
    });
  };

  const canSave =
    isEditing &&
    !isUploading &&
    edit.sections !== null &&
    isSectionsComplete(edit.sections, drafts);

  return (
    <FormSheet
      className="w-[928px]"
      header={
        <FormHeader
          thumbnail={<ImageThumbnail src={logoUrl} alt={`${project.projectName} 로고`} size={50} />}
          title={project.projectName}
          subtitle={`${project.pmName} · ${project.schoolName}`}
        />
      }
      // 피그마: 본문 위에 비어 있는 24px 액션 줄이 있음
      action={null}
      description={
        <div className="flex items-start gap-5">
          <p className="flex-1 text-body-1-regular text-teal-grey-600">{description}</p>
          <RecruitmentList
            recruitments={getVisibleRecruitments(project)}
            partLabels={PART_LABEL}
            className="w-[298px] shrink-0"
          />
        </div>
      }
      // 지원 기간 동안만 취소 · 수정 가능 (false를 넘기면 빈 버튼 영역이 남아서 undefined)
      control={
        project.applicationEditable ? (
          <div className="flex flex-1 items-center justify-center gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="weak"
                  color="neutral"
                  size="lg"
                  className="w-[140px]"
                  disabled={edit.save.isPending}
                  onClick={() => setDrafts(null)}
                >
                  돌아가기
                </Button>
                <Button
                  size="lg"
                  className="w-[140px]"
                  disabled={!canSave}
                  isLoading={edit.save.isPending}
                  onClick={handleSave}
                >
                  수정 완료
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="weak"
                  color="red"
                  size="lg"
                  className="w-[140px]"
                  disabled={isCanceling}
                  onClick={onCancelClick}
                >
                  지원 취소
                </Button>
                <Button
                  variant="weak"
                  size="lg"
                  className="w-[140px]"
                  disabled={!edit.sections || !edit.initialDrafts}
                  onClick={startEdit}
                >
                  수정 하기
                </Button>
              </>
            )}
          </div>
        ) : undefined
      }
    >
      {/* TODO: 불러오는 중 · 실패 화면이 피그마에 나오면 교체 */}
      {(application.isError || edit.isError || form.isError) && (
        <p role="alert" className="text-body-3-medium text-red-500">
          지원서를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {isEditing && edit.sections ? (
        <EditApplicationSections
          sections={edit.sections}
          drafts={drafts}
          onDraftsChange={(update) => setDrafts((prev) => prev && update(prev))}
          onUploadingChange={setIsUploading}
        />
      ) : (
        application.data && <ApplicationForm sections={application.data} />
      )}
    </FormSheet>
  );
};

export default MyApplicationView;
