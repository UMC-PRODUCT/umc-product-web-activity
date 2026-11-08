import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AddIcon, WarningTriangleIcon } from '@umc-product/icons';
import { Button, Dialog, PageHeader, Pagination, SegmentedControl } from '@umc-product/react';
import { useEffect, useRef, useState } from 'react';

import { useChapters } from '@/entities/chapter';
import { getApplicationsView, type Role, useSessionStore, type View } from '@/entities/session';
import { getMatchingStepFromRounds, useMatchingRounds } from '@/features/matching-schedule';
import { type ManagedProject, ProjectManagementCard } from '@/features/project-management';
import { deleteProject } from '@/features/project-management/api/deleteProject';
import { managedProjectsQueryOptions } from '@/features/project-management/api/managedProjectsQuery';
import { cn } from '@/shared/lib/cn';
import { useAppToast } from '@/widgets/toast';

import EmptyDocumentIcon from './assets/empty-document.svg?react';
import ProjectCardDialog from './ProjectCardDialog';

const BREADCRUMBS = [
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '프로젝트 설정', href: '/demo-day/project-settings/notice' },
  { label: '프로젝트 관리' },
];

const getDescription = (role: Role, view: View): string => {
  if (view === 'PM_CHALLENGER') {
    return '내 프로젝트를 등록하고 수정하거나, 매칭 현황을 확인할 수 있어요. 팀 매칭 진행 중에는 프로젝트를 수정할 수 없어요.';
  }
  if (role === 'HQ_ADMIN') {
    return '전체 지부의 프로젝트의 진행 상태(승인대기, 승인완료 등)를 조회할 수 있어요.';
  }
  if (role === 'CHAPTER_ADMIN') {
    return '내 지부의 프로젝트 정보를 확인하고 수정할 수 있어요. 팀 매칭 진행 중에는 프로젝트를 수정할 수 없어요.';
  }
  return '전체 지부의 프로젝트 정보를 확인하고 수정할 수 있어요. 팀 매칭 진행 중에는 프로젝트를 수정할 수 없어요.';
};

const EmptyState = ({
  showRegisterButton,
  onRegister,
}: {
  showRegisterButton: boolean;
  onRegister?: () => void;
}) => (
  <div className="flex flex-col items-center gap-6 py-20">
    <EmptyDocumentIcon width={56} height={56} className="text-teal-grey-200" />
    <div className="flex flex-col items-center gap-2">
      <p className="text-title-3-medium text-placeholder">등록된 프로젝트가 없어요</p>
      <p className="text-heading-5-medium text-placeholder">
        챌린저들이 프로젝트를 등록한 후 확인할 수 있어요.
      </p>
    </div>
    {showRegisterButton && (
      <Button size="sm" onClick={onRegister}>
        <div className="flex items-center gap-2">
          <AddIcon size={16} />
          프로젝트 등록
        </div>
      </Button>
    )}
  </div>
);

type ProjectsPageProps = {
  initialChapterId?: number;
  onChapterChange?: (chapterId: number) => void;
};

const ProjectsPage = ({ initialChapterId, onChapterChange }: ProjectsPageProps) => {
  const role = useSessionStore((state) => state.session.role);
  const view = useSessionStore((state) => state.view);
  const ownChapterId = useSessionStore((state) => state.session.serverChapterId);
  const gisuId = useSessionStore((state) => state.session.gisuId);
  const { data: allChapters = [] } = useChapters(gisuId);
  const isChapterLeader = role === 'CHAPTER_ADMIN';
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    initialChapterId ?? (isChapterLeader ? ownChapterId : null),
  );
  const chapterId = selectedChapterId ?? allChapters[0]?.id ?? null;

  // URL에 chapterId가 없을 때 chapters가 로드되면 첫 번째 지부 ID를 URL에 반영
  const hasSetDefault = useRef(false);
  useEffect(() => {
    if (initialChapterId !== undefined || hasSetDefault.current || chapterId === null) return;
    hasSetDefault.current = true;
    onChapterChange?.(chapterId);
  }, [chapterId, initialChapterId, onChapterChange]);

  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ManagedProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedProject | null>(null);
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const resolvedView = getApplicationsView(role, view);
  const isPmChallenger = resolvedView === 'PM_CHALLENGER';
  const navigate = useNavigate();

  const [now] = useState(() => new Date());
  const { data: rounds } = useMatchingRounds(
    isPmChallenger ? (ownChapterId ?? undefined) : (chapterId ?? undefined),
  );
  const designStep = rounds
    ? getMatchingStepFromRounds(
        rounds.filter((r) => r.type === 'PLAN_DESIGN'),
        now,
      )
    : null;
  const peStep = rounds
    ? getMatchingStepFromRounds(
        rounds.filter((r) => r.type === 'PLAN_DEVELOPER'),
        now,
      )
    : null;
  const isBeforeStart =
    (designStep === null || designStep.status === 'BEFORE_START') &&
    (peStep === null || peStep.status === 'BEFORE_START');

  const isApplicationPeriod =
    (designStep?.status === 'ONGOING' && designStep.phase === 'APPLY') ||
    (peStep?.status === 'ONGOING' && peStep.phase === 'APPLY');

  // 1차 매칭 기간 이후: 매칭 기간이거나 2차 이상의 지원 기간 (팀원 구성 패널 안내용)
  const hasMatchingStarted = [designStep, peStep].some(
    (step) =>
      step?.status === 'ENDED' ||
      (step?.status === 'ONGOING' && (step.phase === 'MATCHING' || step.round >= 2)),
  );

  const isMatchingPeriod =
    (designStep?.status === 'ONGOING' && designStep.phase === 'MATCHING') ||
    (peStep?.status === 'ONGOING' && peStep.phase === 'MATCHING');

  const { data } = useQuery({
    ...managedProjectsQueryOptions({
      gisuId: gisuId ?? 0,
      chapterId: isPmChallenger ? (ownChapterId ?? undefined) : (chapterId ?? undefined),
      page: page - 1,
      size: 10,
    }),
    enabled: !!gisuId && (isPmChallenger || chapterId !== null),
  });
  const projects = data?.projects ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      setDeleteTarget(null);
      setPage(1);
      toast.show('프로젝트가 삭제됐어요.', { color: 'error' });
      queryClient.invalidateQueries({ queryKey: ['managed-projects'] });
    },
    onError: () => {
      toast.show('프로젝트 삭제에 실패했어요. 다시 시도해 주세요.', { color: 'error' });
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutate(deleteTarget.projectId);
  };

  return (
    <main className="flex min-w-[1082px] flex-col items-start gap-8 px-8 pt-12 pb-20">
      <PageHeader
        className="w-full max-w-[1082px]"
        breadcrumbs={BREADCRUMBS}
        title="프로젝트 관리"
        description={getDescription(role, resolvedView)}
      />

      <div className="flex w-full max-w-[1082px] flex-col">
        <div
          className={cn(
            'flex items-center justify-between gap-4',
            isPmChallenger ? 'pb-0' : 'pb-8',
          )}
        >
          {!isPmChallenger && allChapters.length > 0 && (
            <SegmentedControl
              aria-label="지부 선택"
              items={allChapters.map((c) => ({
                value: String(c.id),
                label:
                  isChapterLeader && c.id !== ownChapterId ? (
                    <span className="text-teal-grey-400" aria-disabled>
                      {c.name}
                    </span>
                  ) : (
                    c.name
                  ),
              }))}
              value={String(selectedChapterId ?? allChapters[0]?.id ?? '')}
              onValueChange={(v) => {
                if (isChapterLeader && Number(v) !== ownChapterId) {
                  toast.show('소속 지부의 프로젝트만 볼 수 있어요', { color: 'error' });
                  return;
                }
                const nextId = Number(v);
                setSelectedChapterId(nextId);
                setPage(1);
                onChapterChange?.(nextId);
              }}
              className="[&_[role=radio]:not([data-checked])]:text-teal-600"
            />
          )}
          {(!isPmChallenger || projects.length > 0) && (
            <Button
              size="sm"
              className="ml-auto h-11 shrink-0"
              disabled={role === 'HQ_ADMIN' || !isBeforeStart}
              onClick={() =>
                navigate({
                  to: '/demo-day/project-settings/projects/new',
                  search: { chapterId: chapterId ?? undefined },
                })
              }
            >
              <div className="flex items-center gap-2">
                <AddIcon size={16} />
                프로젝트 등록
              </div>
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-teal-grey-100 bg-white shadow-drop-neutral-3">
            <EmptyState
              showRegisterButton={isPmChallenger}
              onRegister={() =>
                navigate({
                  to: '/demo-day/project-settings/projects/new',
                  search: { chapterId: chapterId ?? undefined },
                })
              }
            />
          </div>
        ) : isPmChallenger ? (
          <ul className="mt-2 flex flex-col gap-[10px]">
            {projects.map((project) => (
              <li key={project.projectId}>
                <ProjectManagementCard
                  project={project}
                  role={role}
                  isPmChallenger
                  isBeforeStart={isBeforeStart}
                  isApplicationPeriod={isApplicationPeriod}
                  onCardClick={() => setSelectedProject(project)}
                  onViewApplications={() =>
                    navigate({
                      to: '/demo-day/team-matching/applications',
                      search: { chapterId: chapterId ?? undefined },
                    })
                  }
                  onDelete={() => setDeleteTarget(project)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col">
            {(() => {
              const webProjects = projects.filter((p) => p.platform === 'WEB');
              const mobileProjects = projects.filter((p) => p.platform === 'MOBILE');
              return (
                <>
                  {webProjects.length > 0 && (
                    <section className="flex flex-col">
                      <h2 className="mb-[10px] text-title-2-semibold">Web</h2>
                      <ul className="flex flex-col gap-[10px]">
                        {webProjects.map((project) => (
                          <li key={project.projectId}>
                            <ProjectManagementCard
                              project={project}
                              role={role}
                              isBeforeStart={isBeforeStart}
                              isApplicationPeriod={isApplicationPeriod}
                              onCardClick={() => setSelectedProject(project)}
                              onViewApplications={() =>
                                navigate({
                                  to: '/demo-day/team-matching/applications',
                                  search: { chapterId: chapterId ?? undefined },
                                })
                              }
                              onManageApproval={() =>
                                navigate({
                                  to: '/demo-day/project-settings/projects/$projectId',
                                  params: { projectId: project.projectId },
                                  search: { status: project.status },
                                })
                              }
                              onDelete={() => setDeleteTarget(project)}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {mobileProjects.length > 0 && (
                    <section className="mt-10 flex flex-col">
                      <h2 className="mb-[10px] text-title-2-semibold">Mobile</h2>
                      <ul className="flex flex-col gap-[10px]">
                        {mobileProjects.map((project) => (
                          <li key={project.projectId}>
                            <ProjectManagementCard
                              project={project}
                              role={role}
                              isBeforeStart={isBeforeStart}
                              isApplicationPeriod={isApplicationPeriod}
                              onCardClick={() => setSelectedProject(project)}
                              onViewApplications={() =>
                                navigate({
                                  to: '/demo-day/team-matching/applications',
                                  search: { chapterId: chapterId ?? undefined },
                                })
                              }
                              onManageApproval={() =>
                                navigate({
                                  to: '/demo-day/project-settings/projects/$projectId',
                                  params: { projectId: project.projectId },
                                  search: { status: project.status },
                                })
                              }
                              onDelete={() => setDeleteTarget(project)}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              );
            })()}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            className="mt-10 self-center"
            totalPages={totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}
      </div>

      <ProjectCardDialog
        project={selectedProject}
        role={role}
        view={resolvedView}
        isApplicationPeriod={isApplicationPeriod}
        isMatchingPeriod={isMatchingPeriod}
        hasMatchingStarted={hasMatchingStarted}
        onClose={() => setSelectedProject(null)}
      />

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        color="error"
        icon={<WarningTriangleIcon weight="fill" size={24} className="text-red-500" />}
        title="프로젝트를 삭제할까요?"
        description={
          <>
            삭제한 프로젝트는 복구할 수 없어요.
            <br />
            &apos;{deleteTarget?.projectName}&apos; 프로젝트를 삭제하시겠어요?
          </>
        }
        cancelLabel="돌아가기"
        confirmLabel="삭제하기"
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
};

export default ProjectsPage;
