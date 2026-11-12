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
import { type ReactNode, useRef, useState } from 'react';

import type { ApplicationFormSections } from '../api/applicationForm';
import { LONG_ANSWER_MAX_LENGTH, SHORT_ANSWER_MAX_LENGTH } from '../model/limits';

type RecruitmentFormPreviewSheetProps = {
  sections: ApplicationFormSections;
  projectName: string;
  pmName: string;
  schoolName: string;
  logoUrl: string | null;
  description?: ReactNode; // 헤더 아래 프로젝트 소개 · 모집 현황
  onClose: () => void;
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
  onClose,
}: RecruitmentFormPreviewSheetProps) => {
  const [step, setStep] = useState<'COMMON' | 'PART'>('COMMON');
  const anchorRef = useRef<HTMLDivElement>(null);

  // 모달(스크롤되는 Dialog)이 아래로 스크롤된 채 단계가 바뀌면 새 화면도 하단에서 시작하므로 맨 위로 올림
  const goToStep = (next: 'COMMON' | 'PART') => {
    setStep(next);
    anchorRef.current?.closest('[role="dialog"]')?.scrollTo({ top: 0 });
  };

  const commonSections = sections.filter(({ type }) => type !== 'PART');
  // 질문이 하나도 없는 파트 섹션은 없는 것으로 봄
  const partSections = sections.filter(
    ({ type, questions }) => type === 'PART' && questions.length > 0,
  );
  const visibleSections = step === 'COMMON' ? commonSections : partSections;
  const hasPartStep = partSections.length > 0;
  const isLastStep = !hasPartStep || step === 'PART';

  return (
    <FormSheet
      header={
        <FormHeader
          thumbnail={<ImageThumbnail src={logoUrl} alt={`${projectName} 로고`} size={50} />}
          title={projectName}
          subtitle={`${pmName} · ${schoolName}`}
        />
      }
      // 피그마: 본문 위에 비어 있는 24px 액션 줄이 있음
      action={null}
      description={description}
      // 공통 문항만 있으면 넘어갈 곳이 없어서 바로 닫기. 파트 문항이 있으면 다음 → (마지막 페이지) 닫기
      control={
        <div className="flex flex-1 items-center justify-between gap-3">
          {isLastStep ? (
            <>
              {hasPartStep && (
                <Button variant="weak" color="neutral" size="md" onClick={() => goToStep('COMMON')}>
                  돌아가기
                </Button>
              )}
              <Button size="md" className="ml-auto" onClick={onClose}>
                닫기
              </Button>
            </>
          ) : (
            <Button size="md" className="ml-auto" onClick={() => goToStep('PART')}>
              다음
            </Button>
          )}
        </div>
      }
    >
      <div ref={anchorRef} className="flex flex-col gap-6">
        {visibleSections.map((section, si) => (
          // 피그마 Section Control: toggle 헤더 모양에서 스위치만 숨김 (미리보기라 섹션을 끌 수 없음)
          <FormSection
            key={section.sectionId ?? si}
            variant="toggle"
            title={section.title}
            className="[&_.umc-form-section\_\_switch]:hidden"
          >
            <div className="flex flex-col">
              {section.questions.map((q, qi) => (
                <div key={q.questionId ?? qi} className="pt-8 pr-6 pb-[38px] pl-5">
                  <FormQuestion
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
                </div>
              ))}
            </div>
          </FormSection>
        ))}
      </div>
    </FormSheet>
  );
};

export default RecruitmentFormPreviewSheet;
