import {
  Button,
  FormAttachmentField,
  FormChoiceList,
  FormHeader,
  FormQuestion,
  FormSection,
  FormSheet,
  FormTextAnswer,
  ImageThumbnail,
} from '@umc-product/react';
import { type ReactNode, useState } from 'react';

import type { ApplicationFormSections } from '../api/applicationForm';
import { LONG_ANSWER_MAX_LENGTH, SHORT_ANSWER_MAX_LENGTH } from '../model/limits';

type RecruitmentFormPreviewSheetProps = {
  sections: ApplicationFormSections;
  projectName: string;
  pmName: string;
  schoolName: string;
  logoUrl: string | null;
  description?: ReactNode; // 헤더 아래 프로젝트 소개 · 모집 현황
};

// 모집 문항 미리보기 시트. 지원서와 같이 공통 문항 → (다음) → 파트별 문항 순으로 넘겨 볼 수 있음
// 미리보기라 답은 쓸 수 없고, 파트 구분 없이 등록된 파트 문항을 모두 보여줌
const RecruitmentFormPreviewSheet = ({
  sections,
  projectName,
  pmName,
  schoolName,
  logoUrl,
  description,
}: RecruitmentFormPreviewSheetProps) => {
  const [step, setStep] = useState<'COMMON' | 'PART'>('COMMON');

  const commonSections = sections.filter(({ type }) => type !== 'PART');
  const partSections = sections.filter(({ type }) => type === 'PART');
  const visibleSections = step === 'COMMON' ? commonSections : partSections;

  return (
    <FormSheet
      header={
        <FormHeader
          thumbnail={<ImageThumbnail src={logoUrl} alt={`${projectName} 로고`} size={50} />}
          title={projectName}
          subtitle={`${pmName} · ${schoolName}`}
        />
      }
      description={description}
      control={
        <div className="flex flex-1 items-center justify-center gap-3">
          {step === 'PART' ? (
            <Button
              variant="weak"
              color="neutral"
              size="lg"
              className="w-[140px]"
              onClick={() => setStep('COMMON')}
            >
              돌아가기
            </Button>
          ) : (
            <Button
              size="md"
              className="ml-auto"
              disabled={partSections.length === 0}
              onClick={() => setStep('PART')}
            >
              다음
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {visibleSections.map((section, si) => (
          // 피그마 Section Control: toggle 헤더 모양에서 스위치만 숨김 (미리보기라 섹션을 끌 수 없음)
          <FormSection
            key={section.sectionId ?? si}
            variant="toggle"
            title={section.title}
            className="[&_.umc-form-section\_\_switch]:hidden"
          >
            <div className="flex flex-col gap-10 px-5 pt-8 pb-6">
              {section.questions.map((q, qi) => (
                <FormQuestion
                  key={q.questionId ?? qi}
                  number={String(qi + 1).padStart(2, '0')}
                  title={q.title}
                  description={q.description}
                  required={q.isRequired}
                >
                  {(q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') && (
                    <FormTextAnswer
                      disabled
                      placeholder="작성하세요"
                      maxLength={
                        q.type === 'SHORT_TEXT' ? SHORT_ANSWER_MAX_LENGTH : LONG_ANSWER_MAX_LENGTH
                      }
                    />
                  )}
                  {(q.type === 'RADIO' || q.type === 'DROPDOWN') && (
                    <FormChoiceList
                      type="single"
                      disabled
                      options={q.options.map((o) => ({ value: o.content, label: o.content }))}
                    />
                  )}
                  {q.type === 'CHECKBOX' && (
                    <FormChoiceList
                      type="multiple"
                      disabled
                      options={q.options.map((o) => ({ value: o.content, label: o.content }))}
                    />
                  )}
                  {(q.type === 'FILE' || q.type === 'PORTFOLIO') && (
                    <FormAttachmentField disabled />
                  )}
                </FormQuestion>
              ))}
            </div>
          </FormSection>
        ))}
      </div>
    </FormSheet>
  );
};

export default RecruitmentFormPreviewSheet;
