import {
  FIXED_NAME_TITLE,
  FIXED_PORTFOLIO_TITLE,
  withFixedCommonQuestions,
} from './fixedQuestions';

describe('withFixedCommonQuestions', () => {
  it('공통 섹션 맨 앞에 고정 문항 2개를 붙인다', () => {
    const [common, part] = withFixedCommonQuestions([
      {
        sectionId: 1,
        type: 'COMMON',
        title: '공통 문항',
        questions: [{ type: 'SHORT_TEXT', title: '동기', options: [] }],
      },
      { sectionId: 2, type: 'PART', title: 'Design 문항', questions: [] },
    ]);

    expect(common.questions.map(({ title }) => title)).toEqual([
      FIXED_NAME_TITLE,
      FIXED_PORTFOLIO_TITLE,
      '동기',
    ]);
    expect(part.questions).toEqual([]);
  });

  it('이미 고정 문항이 있으면 다시 붙이지 않는다', () => {
    const [common] = withFixedCommonQuestions([
      {
        type: 'COMMON',
        title: '공통 문항',
        questions: [
          { questionId: 1, type: 'SHORT_TEXT', title: FIXED_NAME_TITLE, options: [] },
          { questionId: 2, type: 'PORTFOLIO', title: FIXED_PORTFOLIO_TITLE, options: [] },
        ],
      },
    ]);

    expect(common.questions.map(({ questionId }) => questionId)).toEqual([1, 2]);
  });

  it('지원 폼이 아직 없어도 고정 문항이 보인다', () => {
    const [common] = withFixedCommonQuestions([]);

    expect(common.type).toBe('COMMON');
    expect(common.questions).toHaveLength(2);
  });
});
