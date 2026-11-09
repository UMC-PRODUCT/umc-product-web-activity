import { toId } from '@/shared/api/toId';

import type { ApplicationDetailResponse } from '../api/getApplicationDetail';
import type { AnswerDrafts } from './applyForm';

export const toAnswerDrafts = ({ formResponse }: ApplicationDetailResponse): AnswerDrafts =>
  Object.fromEntries(
    (formResponse?.sections ?? []).flatMap(({ questions = [] }) =>
      questions.flatMap(({ questionId, answer }) => {
        const id = toId(questionId);
        if (id === null) return [];
        const [file] = answer?.files ?? [];
        return [
          [
            id,
            {
              text: answer?.textValue ?? '',
              optionIds: (answer?.selectedOptions ?? []).flatMap(({ questionOptionId }) => {
                const optionId = toId(questionOptionId);
                return optionId === null ? [] : [optionId];
              }),
              file: file?.fileId
                ? { fileId: file.fileId, name: file.originalFileName ?? '' }
                : null,
            },
          ],
        ];
      }),
    ),
  );

export const getAnsweredSectionIds = ({ formResponse }: ApplicationDetailResponse) =>
  new Set(
    (formResponse?.sections ?? []).flatMap(({ sectionId }) => {
      const id = toId(sectionId);
      return id === null ? [] : [id];
    }),
  );
