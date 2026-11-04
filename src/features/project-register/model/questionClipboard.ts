import type { ProjectQuestion, QuestionType } from './types';

// 문항 카드를 Ctrl+C로 복사하면 클립보드 텍스트에 이 접두어를 붙여 넣음. 붙여넣을 때 이 접두어가 있어야 문항으로 취급하고,
// 없으면 입력칸의 일반 텍스트 붙여넣기를 그대로 둠
const PREFIX = 'umc-project-question:';

const QUESTION_TYPES: QuestionType[] = ['SHORT', 'LONG', 'SINGLE', 'MULTIPLE', 'FILE', 'PORTFOLIO'];

export const serializeQuestion = (question: ProjectQuestion) => PREFIX + JSON.stringify(question);

// 클립보드 텍스트가 복사한 문항이면 문항으로, 아니면(일반 텍스트 · 깨진 값) null
export const parseQuestion = (text: string): ProjectQuestion | null => {
  if (!text.startsWith(PREFIX)) return null;
  try {
    const value: Partial<ProjectQuestion> = JSON.parse(text.slice(PREFIX.length));
    if (
      typeof value.title !== 'string' ||
      !value.type ||
      !QUESTION_TYPES.includes(value.type) ||
      !Array.isArray(value.choices)
    ) {
      return null;
    }
    return {
      id: '',
      type: value.type,
      title: value.title,
      description: typeof value.description === 'string' ? value.description : '',
      required: value.required !== false,
      choices: value.choices.map((choice) => ({ id: '', label: String(choice?.label ?? '') })),
    };
  } catch {
    return null;
  }
};
