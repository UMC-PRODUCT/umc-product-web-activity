import { FormAttachmentField, FormChoiceList, FormTextAnswer } from '@umc-product/react';

import type { AnswerDraft, ApplyFormQuestion } from '@/features/applications';
import {
  LONG_ANSWER_MAX_LENGTH,
  SHORT_ANSWER_MAX_LENGTH,
} from '@/features/project-register/model/limits';

// 피그마: 파일은 200MB 이하의 PDF만
const MAX_FILE_SIZE = 200 * 1024 * 1024;
const ACCEPT = ['application/pdf'] as const;

type ApplyQuestionFieldProps = {
  question: ApplyFormQuestion;
  draft: AnswerDraft;
  isUploading: boolean;
  fileError: string | undefined;
  onChange: (draft: AnswerDraft) => void;
  onFileSelect: (file: File) => void;
  onFileReject: (reason: 'type' | 'size') => void;
};

// 문항 종류에 맞는 답 입력칸 (지원서 작성)
const ApplyQuestionField = ({
  question,
  draft,
  isUploading,
  fileError,
  onChange,
  onFileSelect,
  onFileReject,
}: ApplyQuestionFieldProps) => {
  const options = [...question.options]
    .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
    .map(({ optionId, content }) => ({ value: String(optionId), label: content }));

  switch (question.type) {
    case 'SHORT_TEXT':
    case 'LONG_TEXT':
      return (
        <FormTextAnswer
          placeholder="작성하세요"
          // 피그마: 주관식 · 장문형 모두 글자 수(0/N)를 보여 줌. 한도는 폼을 만들 때와 같음
          maxLength={
            question.type === 'SHORT_TEXT' ? SHORT_ANSWER_MAX_LENGTH : LONG_ANSWER_MAX_LENGTH
          }
          value={draft.text}
          onChange={(event) => onChange({ ...draft, text: event.target.value })}
        />
      );
    case 'RADIO':
    case 'DROPDOWN':
      return (
        <FormChoiceList
          type="single"
          options={options}
          value={draft.optionIds.length > 0 ? String(draft.optionIds[0]) : null}
          onValueChange={(value) => onChange({ ...draft, optionIds: [Number(value)] })}
        />
      );
    case 'CHECKBOX':
      return (
        <FormChoiceList
          type="multiple"
          options={options}
          value={draft.optionIds.map(String)}
          onValueChange={(values) => onChange({ ...draft, optionIds: values.map(Number) })}
        />
      );
    case 'FILE':
    case 'PORTFOLIO':
      return (
        <FormAttachmentField
          accept={ACCEPT}
          maxSize={MAX_FILE_SIZE}
          disabled={isUploading}
          attachment={draft.file ? { label: draft.file.name } : null}
          // 파일 대신 링크를 적어도 됨 (포트폴리오 링크)
          value={draft.text}
          onChange={(event) => onChange({ ...draft, text: event.target.value })}
          invalid={fileError !== undefined}
          errorMessage={fileError}
          onFileSelect={onFileSelect}
          onReject={({ reason }) => onFileReject(reason)}
          onAttachmentRemove={() => onChange({ ...draft, file: null })}
        />
      );
    // TODO: 일정 문항은 피그마에 없음. 나오면 입력칸 추가
    default:
      return null;
  }
};

export default ApplyQuestionField;
