import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UsersPictogram } from '@umc-product/icons';
import { Button, Dimmed } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import { useState } from 'react';

import { ProjectRecruitmentSummary } from '@/features/applications';
import {
  getRecruitmentRows,
  type Project,
  type ProjectActions,
  type ProjectPeriod,
  TeamCompositionPanel,
} from '@/features/project-list';
import { RecruitmentFormPreviewSheet } from '@/features/project-register';
import { getApplicationForm } from '@/features/project-register/api/applicationForm';
import { withFixedCommonQuestions } from '@/features/project-register/model/fixedQuestions';
import { ProjectCard } from '@/widgets/card';

type ProjectDetailModalProps = {
  project: Project | null; // null이면 닫힘
  period: ProjectPeriod;
  actions: ProjectActions | null;
  onClose: () => void;
};

// 프로젝트 목록에서 카드를 누르면 뜨는 상세 모달. 하단 버튼은 권한 · 기간에 따라 달라짐
const ProjectDetailModal = ({ project, period, actions, onClose }: ProjectDetailModalProps) => {
  const [teamPanelOpen, setTeamPanelOpen] = useState(false);
  const [recruitmentFormOpen, setRecruitmentFormOpen] = useState(false);
  const navigate = useNavigate();

  const { data: applicationFormData } = useQuery({
    queryKey: ['application-form', project?.projectId],
    queryFn: () => getApplicationForm(Number(project!.projectId)),
    enabled: recruitmentFormOpen && project !== null,
  });
  const formSections = withFixedCommonQuestions(applicationFormData?.sections ?? []);

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setTeamPanelOpen(false);
    setRecruitmentFormOpen(false);
    onClose();
  };

  const handlePrimaryClick = () => {
    if (actions?.primary?.kind === 'EDIT_PROJECT' && project) {
      navigate({
        to: '/demo-day/project-settings/projects/$projectId',
        params: { projectId: project.projectId },
        search: {},
      });
      return;
    }
    if (actions?.primary?.kind === 'RECRUIT_QUESTIONS') {
      setRecruitmentFormOpen(true);
      return;
    }
    if (actions?.primary?.kind === 'MY_APPLICATION') {
      // 내 지원 현황에서 지원서를 열람 (수정은 지원 기간에만 가능)
      navigate({ to: '/demo-day/team-matching/applications' });
      return;
    }
    if (actions?.primary?.kind === 'APPLY' && project) {
      // 지원서 시트로 이동. 상세 카드는 선택된 채로 숨겨져 있다가 시트를 닫으면 다시 보임
      navigate({
        to: '/demo-day/team-matching/projects/$projectId/apply',
        params: { projectId: project.projectId },
      });
    }
  };

  return (
    <Dialog.Root open={project !== null} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Dimmed />
        </Dialog.Overlay>
        {project && actions && (
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) max-h-[calc(100vh-40px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] outline-none"
          >
            <Dialog.Title className="sr-only">{project.projectName}</Dialog.Title>
            <ProjectCard
              projectName={project.projectName}
              logoUrl={project.logoUrl}
              thumbnailUrl={project.thumbnailUrl}
              pmName={project.pmName}
              schoolName={project.schoolName}
              description={project.description}
              recruitments={getRecruitmentRows(project, period, 'detail')}
              actionNotice={actions.primary?.notice ?? undefined}
              actions={
                <>
                  {actions.showTeamButton && (
                    <Button
                      variant="weak"
                      color="neutral"
                      size="md"
                      icon={<UsersPictogram size={30} color="var(--color-icon-subtle)" />}
                      aria-label="팀원 구성 보기"
                      onClick={() => setTeamPanelOpen(true)}
                    />
                  )}
                  <Button
                    variant="weak"
                    size="md"
                    className="flex-1"
                    disabled={project.planUrl === null}
                    onClick={() => window.open(project.planUrl ?? '', '_blank', 'noopener')}
                  >
                    기획보기
                  </Button>
                  {actions.primary && (
                    <Button
                      size="md"
                      className="flex-1"
                      disabled={actions.primary.disabled}
                      onClick={handlePrimaryClick}
                    >
                      {actions.primary.label}
                    </Button>
                  )}
                </>
              }
            />
            <TeamCompositionPanel
              open={teamPanelOpen}
              onOpenChange={setTeamPanelOpen}
              recruitments={project.recruitments}
              // 1차 매칭 기간 이후: 매칭 기간이거나 2차 이상의 지원 기간
              hasMatchingStarted={
                period.phase === 'MATCHING' || (period.phase === 'APPLY' && period.round >= 2)
              }
            />
            <Dialog.Root open={recruitmentFormOpen} onOpenChange={setRecruitmentFormOpen}>
              <Dialog.Portal>
                <Dialog.Overlay asChild>
                  <Dimmed />
                </Dialog.Overlay>
                <Dialog.Content
                  aria-describedby={undefined}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="fixed top-1/2 left-1/2 z-(--umc-z-dimmed) max-h-[calc(100vh-40px)] w-[1000px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[20px] outline-none"
                >
                  <Dialog.Title className="sr-only">모집 문항 미리보기</Dialog.Title>
                  <RecruitmentFormPreviewSheet
                    sections={formSections}
                    projectName={project.projectName}
                    pmName={project.pmName}
                    schoolName={project.schoolName}
                    logoUrl={project.logoUrl}
                    description={
                      <ProjectRecruitmentSummary
                        description={project.description}
                        platform={project.platform}
                        recruitments={project.recruitments}
                      />
                    }
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProjectDetailModal;
