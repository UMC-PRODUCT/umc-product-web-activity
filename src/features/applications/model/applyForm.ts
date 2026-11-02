import type { components } from '@/types/api';

import type { ApplicationAnswerItem } from '../api/saveApplicationAnswers';
import type { RecruitPart } from './types';

export type ApplyFormSection = components['schemas']['ApplicationFormSection'];
export type ApplyFormQuestion = ApplyFormSection['questions'][number];

// 지원서를 쓰는 중인 한 문항의 답. 문항 종류에 따라 쓰는 칸이 다름
export type AnswerDraft = {
  text: string; // 단답 · 장문
  optionIds: number[]; // 객관식 · 체크박스 · 드롭다운
  file: { fileId: string; name: string } | null; // 파일 · 포트폴리오
};

export type AnswerDrafts = Record<number, AnswerDraft>;

export const EMPTY_ANSWER: AnswerDraft = { text: '', optionIds: [], file: null };

// 챌린저 파트 → 지원 폼 문항 묶음의 대상 파트
const SERVER_PART: Record<RecruitPart, string> = {
  DESIGN: 'DESIGN',
  WEB_PE: 'WEB_PRODUCT_ENGINEER',
  MOBILE_PE: 'MOBILE_PRODUCT_ENGINEER',
};

const byOrder = (a: { orderNo?: number }, b: { orderNo?: number }) =>
  (a.orderNo ?? 0) - (b.orderNo ?? 0);

// 공통 문항 (지원서 1단계)
export const getCommonSections = (sections: ApplyFormSection[]) =>
  sections.filter(({ type }) => type === 'COMMON').sort(byOrder);

// 내 파트 문항 (지원서 2단계). 대상 파트를 지정하지 않은 묶음은 모든 파트가 봄
export const getPartSections = (sections: ApplyFormSection[], part: RecruitPart | null) =>
  sections
    .filter(({ type, allowedParts = [] }) => {
      if (type !== 'PART') return false;
      return (
        allowedParts.length === 0 ||
        (part !== null && allowedParts.some((p) => p === SERVER_PART[part]))
      );
    })
    .sort(byOrder);

export const getSortedQuestions = ({ questions }: ApplyFormSection) => [...questions].sort(byOrder);

const isAnswered = (question: ApplyFormQuestion, { text, optionIds, file }: AnswerDraft) => {
  switch (question.type) {
    case 'RADIO':
    case 'CHECKBOX':
    case 'DROPDOWN':
      return optionIds.length > 0;
    case 'FILE':
    case 'PORTFOLIO':
      // 파일을 올리거나 링크를 적으면 채운 것
      return file !== null || text.trim() !== '';
    default:
      return text.trim() !== '';
  }
};

// 필수 문항이 모두 채워졌는지 (문항 ID가 없는 문항은 답할 수 없어 건너뜀)
export const isSectionsComplete = (sections: ApplyFormSection[], drafts: AnswerDrafts) =>
  sections.every((section) =>
    section.questions.every(
      (question) =>
        !question.isRequired ||
        question.questionId === undefined ||
        isAnswered(question, drafts[question.questionId] ?? EMPTY_ANSWER),
    ),
  );

// 임시저장 · 제출 전에 서버로 보낼 답변 목록. 비어 있는 문항은 보내지 않음
export const toAnswerItems = (
  sections: ApplyFormSection[],
  drafts: AnswerDrafts,
): ApplicationAnswerItem[] =>
  sections.flatMap(({ questions }) =>
    questions.flatMap<ApplicationAnswerItem>((question) => {
      const { questionId } = question;
      if (questionId === undefined) return [];
      const draft = drafts[questionId] ?? EMPTY_ANSWER;
      if (!isAnswered(question, draft)) return [];

      switch (question.type) {
        case 'RADIO':
        case 'CHECKBOX':
        case 'DROPDOWN':
          return [{ questionId, selectedOptionIds: draft.optionIds }];
        case 'FILE':
        case 'PORTFOLIO':
          // 파일은 fileIds로, 링크는 textValue로 보냄 (파일이 있으면 파일이 우선)
          return draft.file
            ? [{ questionId, fileIds: [draft.file.fileId] }]
            : [{ questionId, textValue: draft.text.trim() }];
        default:
          return [{ questionId, textValue: draft.text }];
      }
    }),
  );
