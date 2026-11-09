import { skipToken, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toId } from '@/shared/api/toId';

import { getApplicationDetail } from '../api/getApplicationDetail';
import { applicationKeys } from '../api/queryKeys';
import { type ApplicationAnswerItem, saveApplicationAnswers } from '../api/saveApplicationAnswers';
import type { ApplyFormSection } from '../model/applyForm';
import { getAnsweredSectionIds, toAnswerDrafts } from '../model/toAnswerDrafts';

type ApplicationTarget = { projectId: number; applicationId: number };

export const useEditApplication = (
  target: ApplicationTarget | null,
  formSections: ApplyFormSection[] | undefined,
) => {
  const queryClient = useQueryClient();

  const detail = useQuery({
    queryKey: applicationKeys.detail(target?.projectId ?? null, target?.applicationId ?? null),
    queryFn: target === null ? skipToken : () => getApplicationDetail(target),
  });
  const answeredSectionIds = detail.data ? getAnsweredSectionIds(detail.data) : null;
  const sections =
    formSections && answeredSectionIds
      ? formSections.filter(({ sectionId }) => {
          const id = toId(sectionId);
          return id !== null && answeredSectionIds.has(id);
        })
      : null;

  const save = useMutation({
    mutationFn: (answers: ApplicationAnswerItem[]) => {
      if (target === null) throw new Error('지원서를 찾지 못했어요.');
      return saveApplicationAnswers({ ...target, answers });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  });

  return {
    sections,
    initialDrafts: detail.data ? toAnswerDrafts(detail.data) : null,
    isError: detail.isError,
    save,
  };
};
