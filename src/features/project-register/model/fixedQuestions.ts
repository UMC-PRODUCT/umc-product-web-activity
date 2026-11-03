import type { ApplicationFormSections } from '../api/applicationForm';

// 공통 문항 1 · 2번은 모든 프로젝트에 고정. 지원 폼 저장 때 서버에도 같이 넣어서 챌린저가 답할 수 있게 함
export const FIXED_NAME_TITLE = '지원자님의 이름/닉네임을 작성해주세요';
export const FIXED_PORTFOLIO_TITLE = '포트폴리오를 업로드해주세요';

type Section = ApplicationFormSections[number];
export type FormQuestionItem = Section['questions'][number];

export const FIXED_COMMON_QUESTIONS: FormQuestionItem[] = [
  { type: 'SHORT_TEXT', title: FIXED_NAME_TITLE, isRequired: true, options: [] },
  { type: 'PORTFOLIO', title: FIXED_PORTFOLIO_TITLE, isRequired: true, options: [] },
];

export const isFixedCommonQuestion = ({ type, title }: Pick<FormQuestionItem, 'type' | 'title'>) =>
  FIXED_COMMON_QUESTIONS.some((fixed) => fixed.type === type && fixed.title === title);

// 고정 문항이 아직 서버에 없는 지원 폼(이전에 저장한 프로젝트)도 미리보기에서는 고정 문항이 보이게, 공통 섹션 맨 앞에 붙임.
// 공통 섹션이 없으면(폼이 아직 없음) 새로 만듦
export const withFixedCommonQuestions = (sections: ApplicationFormSections): Section[] => {
  const prependFixed = (questions: Section['questions']) =>
    questions.slice(0, FIXED_COMMON_QUESTIONS.length).every(isFixedCommonQuestion)
      ? questions
      : [
          ...FIXED_COMMON_QUESTIONS,
          ...questions.filter((question) => !isFixedCommonQuestion(question)),
        ];

  if (!sections.some(({ type }) => type === 'COMMON')) {
    return [{ type: 'COMMON', title: '공통 문항', questions: FIXED_COMMON_QUESTIONS }, ...sections];
  }
  return sections.map((section) =>
    section.type === 'COMMON'
      ? { ...section, questions: prependFixed(section.questions) }
      : section,
  );
};
