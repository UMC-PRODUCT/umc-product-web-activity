import type {
  ApplicationFormResponse,
  ApplicationFormSections,
  UpsertApplicationFormRequest,
} from '../api/applicationForm';
import { FIXED_COMMON_QUESTIONS, isFixedCommonQuestion } from '../model/fixedQuestions';
import type {
  PePlatform,
  ProjectDraft,
  ProjectQuestion,
  QuestionSectionKey,
  QuestionType,
} from '../model/types';

type FormSection = UpsertApplicationFormRequest['sections'][number];
type FormQuestion = FormSection['questions'][number];
type ServerPart = NonNullable<FormSection['allowedParts']>[number];

const QUESTION_TYPE: Record<QuestionType, FormQuestion['type']> = {
  SHORT: 'SHORT_TEXT',
  LONG: 'LONG_TEXT',
  SINGLE: 'RADIO',
  MULTIPLE: 'CHECKBOX',
  FILE: 'FILE',
  PORTFOLIO: 'PORTFOLIO',
};

const FROM_SERVER_TYPE = Object.fromEntries(
  Object.entries(QUESTION_TYPE).map(([type, serverType]) => [serverType, type]),
) as Record<string, QuestionType>;

const PE_PART: Record<PePlatform, ServerPart> = {
  WEB: 'WEB_PRODUCT_ENGINEER',
  MOBILE: 'MOBILE_PRODUCT_ENGINEER',
};

const SECTION_TITLE: Record<QuestionSectionKey, string> = {
  COMMON: '공통 문항',
  DESIGN: 'Design 문항',
  PE: 'PE 문항',
};

// 서버에 이미 있는 폼의 섹션 · 문항 · 선택지 ID를 순서대로 이어 붙임. ID 없이 보내면 서버가 기존 섹션과 짝을 못 맞춤
type ServerSection = ApplicationFormSections[number];
type ServerQuestion = ServerSection['questions'][number];

const toQuestion = (
  { type, title, description, required, choices }: ProjectQuestion,
  index: number,
  serverQuestions: ServerQuestion[],
): FormQuestion => ({
  questionId: serverQuestions[index]?.questionId,
  type: QUESTION_TYPE[type],
  title,
  description,
  isRequired: required,
  orderNo: index + 1,
  options: choices.map(({ label }, optionIndex) => ({
    optionId: serverQuestions[index]?.options?.[optionIndex]?.optionId,
    content: label,
    orderNo: optionIndex + 1,
  })),
});

// 플랫폼을 아직 모르면(모집 정보 전) PE 문항은 Web · Mobile PE 모두 대상
const getPeParts = (pePlatform: PePlatform | null): ServerPart[] =>
  pePlatform ? [PE_PART[pePlatform]] : [PE_PART.WEB, PE_PART.MOBILE];

// 화면 문항 → 지원 폼 저장 요청. 공통 문항은 항상, Design · PE 섹션은 켜 둔 것만 보냄
// 공통 문항 맨 앞에 고정 문항 2개를 넣고, 나머지 문항은 그 뒤로 번호를 이어 매김. 서버에 이미 있는 문항은 ID를 같이 보냄
const withFixedQuestions = (
  items: FormQuestion[],
  serverQuestions: ServerQuestion[],
): FormQuestion[] => {
  const fixedCount = FIXED_COMMON_QUESTIONS.length;
  const hasFixedOnServer = serverQuestions.slice(0, fixedCount).every(isFixedCommonQuestion);
  const fixed = FIXED_COMMON_QUESTIONS.map((question, index) => ({
    ...question,
    questionId: hasFixedOnServer ? serverQuestions[index]?.questionId : undefined,
    orderNo: index + 1,
  }));
  const custom = items.map((item, index) => {
    const serverQuestion = hasFixedOnServer
      ? serverQuestions[fixedCount + index]
      : serverQuestions[index];
    return {
      ...item,
      questionId: serverQuestion?.questionId,
      orderNo: fixedCount + index + 1,
      options: item.options.map((option, optionIndex) => ({
        ...option,
        optionId: serverQuestion?.options?.[optionIndex]?.optionId,
      })),
    };
  });
  return [...fixed, ...custom];
};

const findServerSection = (
  existing: ApplicationFormSections,
  key: QuestionSectionKey,
): ServerSection | undefined =>
  existing.find(({ type, allowedParts }) =>
    key === 'COMMON'
      ? type === 'COMMON'
      : type === 'PART' && allowedParts?.includes('DESIGN') === (key === 'DESIGN'),
  );

export const toApplicationFormRequest = (
  { questions, sectionEnabled, recruit }: ProjectDraft,
  existing: ApplicationFormSections = [],
): UpsertApplicationFormRequest => {
  const toQuestions = (key: QuestionSectionKey) => {
    const serverQuestions = findServerSection(existing, key)?.questions ?? [];
    const items = questions[key].map((question, index) =>
      toQuestion(question, index, serverQuestions),
    );
    return key === 'COMMON' ? withFixedQuestions(items, serverQuestions) : items;
  };
  const sections: FormSection[] = [
    {
      sectionId: findServerSection(existing, 'COMMON')?.sectionId,
      type: 'COMMON',
      title: SECTION_TITLE.COMMON,
      orderNo: 1,
      questions: toQuestions('COMMON'),
    },
  ];
  if (sectionEnabled.DESIGN) {
    sections.push({
      sectionId: findServerSection(existing, 'DESIGN')?.sectionId,
      type: 'PART',
      allowedParts: ['DESIGN'],
      title: SECTION_TITLE.DESIGN,
      orderNo: sections.length + 1,
      questions: toQuestions('DESIGN'),
    });
  }
  if (sectionEnabled.PE) {
    sections.push({
      sectionId: findServerSection(existing, 'PE')?.sectionId,
      type: 'PART',
      allowedParts: getPeParts(recruit.pePlatform),
      title: SECTION_TITLE.PE,
      orderNo: sections.length + 1,
      questions: toQuestions('PE'),
    });
  }
  return { title: '지원서', sections };
};

// 지원 폼 → 화면 문항. 서버 ID는 화면 안에서만 쓰는 문자열 ID로 씀
export const fromApplicationForm = (
  form: ApplicationFormResponse | null | undefined,
): Pick<ProjectDraft, 'questions' | 'sectionEnabled'> => {
  const result: Pick<ProjectDraft, 'questions' | 'sectionEnabled'> = {
    questions: { COMMON: [], DESIGN: [], PE: [] },
    sectionEnabled: { DESIGN: false, PE: false },
  };

  [...(form?.sections ?? [])]
    .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
    .forEach(({ type, allowedParts, questions }) => {
      const key: QuestionSectionKey =
        type === 'COMMON' ? 'COMMON' : allowedParts?.includes('DESIGN') ? 'DESIGN' : 'PE';
      if (key !== 'COMMON') result.sectionEnabled[key] = true;
      result.questions[key] = [...questions]
        .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
        // 고정 문항은 화면에 따로 그려지므로 편집 목록에서는 뺌
        .filter((question) => key !== 'COMMON' || !isFixedCommonQuestion(question))
        .map((question, index) => ({
          id: `server-${key}-${question.questionId ?? index}`,
          type: FROM_SERVER_TYPE[question.type] ?? 'SHORT',
          title: question.title,
          description: question.description ?? '',
          required: question.isRequired ?? true,
          choices: [...(question.options ?? [])]
            .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
            .map((option, optionIndex) => ({
              id: `server-${key}-${question.questionId ?? index}-${option.optionId ?? optionIndex}`,
              label: option.content,
            })),
        }));
    });

  return result;
};
