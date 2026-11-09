import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  Button,
  Dialog as SubmittedDialog,
  Dimmed,
  FormHeader,
  FormQuestion,
  FormSection,
  FormSheet,
  ImageThumbnail,
} from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { useApplicationsView, useSessionStore } from '@/entities/session';
import {
  type AnswerDrafts,
  type ApplyFormSection,
  EMPTY_ANSWER,
  getCommonSections,
  getPartSections,
  getSortedQuestions,
  getVisibleRecruitments,
  isSectionsComplete,
  RecruitmentList,
  toAnswerItems,
  uploadApplicationFile,
  useSubmitApplication,
} from '@/features/applications';
import { findApplyRoundId, useMatchingRounds } from '@/features/matching-schedule';
import { useProjectById, useProjectViewer } from '@/features/project-list';
import { getApplicationForm } from '@/features/project-register/api/applicationForm';

import { useProjectPeriod } from '../-projects/useProjectPeriod';
import ApplyQuestionField from './ApplyQuestionField';

const PART_LABEL = { DESIGN: 'Design', WEB_PE: 'Web', MOBILE_PE: 'Mobile' } as const;

const FILE_REJECT_MESSAGE = {
  type: 'PDF 파일만 올릴 수 있어요.',
  size: '파일은 200MB 이하만 올릴 수 있어요.',
} as const;

type ApplyPageProps = {
  projectId: number;
};

// 피그마 지원하기: 프로젝트 목록 위에 뜨는 지원서 시트. 공통 문항 → 내 파트 문항 순서로 쓰고 제출하면 확인 창이 뜸
const ApplyPage = ({ projectId }: ApplyPageProps) => {
  const navigate = useNavigate();
  const session = useSessionStore((state) => state.session);
  const view = useApplicationsView();
  const viewer = useProjectViewer(session, view);
  const period = useProjectPeriod(session, view, viewer);

  const { data: project } = useProjectById(projectId);
  const { data: applicationForm } = useQuery({
    queryKey: ['application-form', projectId],
    queryFn: () => getApplicationForm(projectId),
  });
  const { data: rounds } = useMatchingRounds(session.serverChapterId ?? undefined);
  const submit = useSubmitApplication();

  const [step, setStep] = useState<'COMMON' | 'PART'>('COMMON');
  const [drafts, setDrafts] = useState<AnswerDrafts>({});
  const [uploadingIds, setUploadingIds] = useState<number[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const formSections = applicationForm?.sections ?? [];
  const commonSections = getCommonSections(formSections);
  const partSections = getPartSections(formSections, viewer.challengerPart);
  // 내 파트 문항이 없으면 공통 문항에서 바로 제출
  const hasPartStep = partSections.length > 0;
  const sections: ApplyFormSection[] = step === 'COMMON' ? commonSections : partSections;
  const matchingRoundId = rounds ? findApplyRoundId(rounds, period.track, period.round) : null;

  const goToProjects = () => navigate({ to: '/demo-day/team-matching/projects' });

  const setDraft = (questionId: number, draft: AnswerDrafts[number]) =>
    setDrafts((prev) => ({ ...prev, [questionId]: draft }));

  const handleFileSelect = async (questionId: number, file: File) => {
    setFileErrors(({ [questionId]: _removed, ...rest }) => rest);
    setUploadingIds((prev) => [...prev, questionId]);
    try {
      const fileId = await uploadApplicationFile(file);
      setDraft(questionId, {
        ...(drafts[questionId] ?? EMPTY_ANSWER),
        file: { fileId, name: file.name },
      });
    } catch (error) {
      setFileErrors((prev) => ({
        ...prev,
        [questionId]: error instanceof Error ? error.message : '파일을 올리지 못했어요.',
      }));
    } finally {
      setUploadingIds((prev) => prev.filter((id) => id !== questionId));
    }
  };

  const handleSubmit = () => {
    if (matchingRoundId === null) return;
    submit.mutate(
      {
        projectId,
        matchingRoundId,
        answers: toAnswerItems([...commonSections, ...partSections], drafts),
      },
      { onSuccess: () => setSubmitted(true) },
    );
  };

  const isStepComplete = isSectionsComplete(sections, drafts) && uploadingIds.length === 0;
  const isLastStep = step === 'PART' || !hasPartStep;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !submitted && goToProjects()}>
      {/* 시트는 딤과 같은 층에 두고, 그 위 dialog 층은 제출 완료 창이 씀 */}
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Dimmed />
        </Dialog.Overlay>
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          // 제출 완료 창이 떠 있으면 바깥 클릭 · ESC는 그 창에서만 처리
          onInteractOutside={(e) => submitted && e.preventDefault()}
          onEscapeKeyDown={(e) => submitted && e.preventDefault()}
          className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) max-h-[calc(100vh-40px)] w-[1000px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] outline-none"
        >
          <Dialog.Title className="sr-only">
            {project?.projectName ?? '프로젝트'} 지원하기
          </Dialog.Title>
          <FormSheet
            header={
              <FormHeader
                thumbnail={
                  <ImageThumbnail
                    src={project?.logoUrl ?? null}
                    alt={`${project?.projectName ?? ''} 로고`}
                    size={50}
                  />
                }
                title={project?.projectName ?? ''}
                subtitle={project ? `${project.pmName} · ${project.schoolName}` : undefined}
              />
            }
            // 피그마: 본문 위에 비어 있는 24px 액션 줄이 있음 (모집 문항 보기와 동일)
            action={null}
            description={
              project && (
                <div className="flex items-start gap-5">
                  <p className="flex-1 text-body-1-regular text-teal-grey-600">
                    {project.description}
                  </p>
                  <RecruitmentList
                    recruitments={getVisibleRecruitments(project)}
                    partLabels={PART_LABEL}
                    className="w-[298px] shrink-0"
                  />
                </div>
              )
            }
            control={
              <div className="flex flex-1 items-center justify-center gap-3">
                {step === 'PART' && (
                  <Button
                    variant="weak"
                    color="neutral"
                    size="lg"
                    className="w-[140px]"
                    onClick={() => setStep('COMMON')}
                  >
                    돌아가기
                  </Button>
                )}
                {/* 피그마: 다음 80×48(md, 오른쪽 끝) / 돌아가기 · 지원하기 140×56(lg, 가운데) */}
                <Button
                  size={step === 'PART' ? 'lg' : 'md'}
                  className={step === 'PART' ? 'w-[140px]' : 'ml-auto'}
                  disabled={!isStepComplete || (isLastStep && matchingRoundId === null)}
                  isLoading={submit.isPending}
                  onClick={isLastStep ? handleSubmit : () => setStep('PART')}
                >
                  {isLastStep ? '지원하기' : '다음'}
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-6">
              {sections.map((section) => (
                // 피그마 Section Control: toggle 헤더 모양에서 스위치만 숨김 (작성 중에는 섹션을 끌 수 없음)
                <FormSection
                  key={section.sectionId}
                  variant="toggle"
                  title={section.title}
                  className="[&_.umc-form-section\_\_switch]:hidden"
                >
                  <div className="flex flex-col">
                    {getSortedQuestions(section).map((question, index) => {
                      const { questionId } = question;
                      if (questionId === undefined) return null;
                      return (
                        // 모집 문항 보기와 같은 문항 패딩 (피그마 Question Editor)
                        <div key={questionId} className="pt-8 pr-6 pb-[38px] pl-5">
                          <FormQuestion
                            number={String(index + 1).padStart(2, '0')}
                            title={question.title}
                            description={question.description}
                            required={question.isRequired}
                          >
                            <ApplyQuestionField
                              question={question}
                              draft={drafts[questionId] ?? EMPTY_ANSWER}
                              isUploading={uploadingIds.includes(questionId)}
                              fileError={fileErrors[questionId]}
                              onChange={(draft) => setDraft(questionId, draft)}
                              onFileSelect={(file) => handleFileSelect(questionId, file)}
                              onFileReject={(reason) =>
                                setFileErrors((prev) => ({
                                  ...prev,
                                  [questionId]: FILE_REJECT_MESSAGE[reason],
                                }))
                              }
                            />
                          </FormQuestion>
                        </div>
                      );
                    })}
                  </div>
                </FormSection>
              ))}
              {submit.isError && (
                <p role="alert" className="text-body-3-medium text-red-500">
                  {submit.error.message}
                </p>
              )}
            </div>
          </FormSheet>
        </Dialog.Content>
        <SubmittedDialog
          // 아래 radix 모달이 body 클릭을 막아서(pointer-events: none) 제출 완료 창만 다시 열어 줌
          className="pointer-events-auto"
          open={submitted}
          // 두 버튼 중 하나로만 닫음 (버튼을 눌러도 onOpenChange가 불려서 여기서는 이동하지 않음)
          onOpenChange={() => {}}
          title="지원서를 제출했어요"
          description="내 지원 현황에서 지원서를 확인하고, 지원 기간이 끝나기 전까지 수정할 수 있어요."
          cancelLabel="지원 현황 가기"
          onCancel={() => navigate({ to: '/demo-day/team-matching/applications' })}
          confirmLabel="확인"
          onConfirm={goToProjects}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ApplyPage;
