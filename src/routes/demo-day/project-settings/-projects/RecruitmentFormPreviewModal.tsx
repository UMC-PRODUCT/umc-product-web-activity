import { useQuery } from '@tanstack/react-query';
import { Dimmed } from '@umc-product/react';
import { Dialog } from 'radix-ui';
import type { ComponentProps } from 'react';

import { ProjectRecruitmentSummary } from '@/features/applications';
import { RecruitmentFormPreviewSheet } from '@/features/project-register';
import { getApplicationForm } from '@/features/project-register/api/applicationForm';
import { withFixedCommonQuestions } from '@/features/project-register/model/fixedQuestions';

type RecruitmentFormPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  pmName: string;
  schoolName: string;
  logoUrl: string | null;
  description: string;
  platform: 'WEB' | 'MOBILE';
  recruitments: ComponentProps<typeof ProjectRecruitmentSummary>['recruitments'];
};

const RecruitmentFormPreviewModal = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  pmName,
  schoolName,
  logoUrl,
  description,
  platform,
  recruitments,
}: RecruitmentFormPreviewModalProps) => {
  const { data } = useQuery({
    queryKey: ['application-form', projectId],
    queryFn: () => getApplicationForm(Number(projectId)),
    enabled: open,
  });
  const formSections = withFixedCommonQuestions(data?.sections ?? []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
            projectName={projectName}
            pmName={pmName}
            schoolName={schoolName}
            logoUrl={logoUrl}
            description={
              <ProjectRecruitmentSummary
                description={description}
                platform={platform}
                recruitments={recruitments}
              />
            }
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RecruitmentFormPreviewModal;
