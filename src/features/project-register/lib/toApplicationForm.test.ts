import { createInitialDraft, createQuestion } from '../model/draft';
import { FIXED_NAME_TITLE, FIXED_PORTFOLIO_TITLE } from '../model/fixedQuestions';
import type { PePlatform } from '../model/types';
import { fromApplicationForm, toApplicationFormRequest } from './toApplicationForm';

const draftWithQuestions = () => {
  const single = { ...createQuestion('SINGLE'), title: '선호 파트', required: false };
  single.choices = [
    { id: 'a', label: 'Web' },
    { id: 'b', label: 'Mobile' },
  ];
  return {
    ...createInitialDraft(),
    recruit: { designCount: 1, peCount: 2, pePlatform: 'MOBILE' as PePlatform | null },
    questions: {
      COMMON: [{ ...createQuestion('SHORT'), title: '지원 동기' }],
      DESIGN: [],
      PE: [single],
    },
    sectionEnabled: { DESIGN: false, PE: true },
  };
};

describe('toApplicationFormRequest', () => {
  it('공통 섹션은 항상, 켜 둔 파트 섹션만 보낸다', () => {
    const { sections } = toApplicationFormRequest(draftWithQuestions());
    expect(sections.map(({ type, allowedParts }) => [type, allowedParts])).toEqual([
      ['COMMON', undefined],
      ['PART', ['MOBILE_PRODUCT_ENGINEER']],
    ]);
  });

  it('질문 유형 · 필수 여부 · 선택지를 서버 형식으로 바꾼다', () => {
    const [common, pe] = toApplicationFormRequest(draftWithQuestions()).sections;
    expect(common.questions[0]).toMatchObject({
      type: 'SHORT_TEXT',
      isRequired: true,
      options: [],
    });
    expect(pe.questions[0]).toMatchObject({
      type: 'RADIO',
      isRequired: false,
      options: [
        { content: 'Web', orderNo: 1 },
        { content: 'Mobile', orderNo: 2 },
      ],
    });
  });

  it('서버에 이미 있는 섹션 · 문항 · 선택지는 ID를 같이 보낸다', () => {
    const draft = createInitialDraft();
    draft.questions.COMMON = [
      {
        id: 'q',
        type: 'SINGLE',
        title: '질문',
        description: '',
        required: true,
        choices: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ],
      },
    ];

    const { sections } = toApplicationFormRequest(draft, [
      {
        sectionId: 7,
        type: 'COMMON',
        title: '공통 문항',
        questions: [
          {
            questionId: 70,
            type: 'RADIO',
            title: '질문',
            options: [
              { optionId: 700, content: 'A' },
              { optionId: 701, content: 'B' },
            ],
          },
        ],
      },
    ]);

    expect(sections[0].sectionId).toBe(7);
    expect(sections[0].questions[2].questionId).toBe(70);
    expect(sections[0].questions[2].options.map(({ optionId }) => optionId)).toEqual([700, 701]);
  });

  it('공통 섹션 맨 앞에 고정 문항 2개를 넣고 추가 문항은 3번부터 매긴다', () => {
    const draft = createInitialDraft();
    draft.questions.COMMON = [{ ...createQuestion('SHORT'), title: '동기' }];

    const [common] = toApplicationFormRequest(draft).sections;

    expect(common.questions.map(({ type, title, orderNo }) => [type, title, orderNo])).toEqual([
      ['SHORT_TEXT', FIXED_NAME_TITLE, 1],
      ['PORTFOLIO', FIXED_PORTFOLIO_TITLE, 2],
      ['SHORT_TEXT', '동기', 3],
    ]);
  });

  it('서버에서 받은 고정 문항은 편집 목록에서 빼고, 다시 저장할 때 ID를 이어 보낸다', () => {
    const form = {
      sections: [
        {
          sectionId: 7,
          type: 'COMMON' as const,
          title: '공통 문항',
          questions: [
            {
              questionId: 1,
              type: 'SHORT_TEXT' as const,
              title: FIXED_NAME_TITLE,
              options: [],
              orderNo: 1,
            },
            {
              questionId: 2,
              type: 'PORTFOLIO' as const,
              title: FIXED_PORTFOLIO_TITLE,
              options: [],
              orderNo: 2,
            },
            { questionId: 3, type: 'SHORT_TEXT' as const, title: '동기', options: [], orderNo: 3 },
          ],
        },
      ],
    };

    const { questions } = fromApplicationForm(form);
    expect(questions.COMMON.map(({ title }) => title)).toEqual(['동기']);

    const draft = { ...createInitialDraft(), questions };
    const [common] = toApplicationFormRequest(draft, form.sections).sections;
    expect(common.questions.map(({ questionId }) => questionId)).toEqual([1, 2, 3]);
  });

  it('플랫폼을 모르면 PE 섹션은 Web · Mobile PE 모두 대상이다', () => {
    const draft = draftWithQuestions();
    draft.recruit.pePlatform = null;
    const pe = toApplicationFormRequest(draft).sections[1];
    expect(pe.allowedParts).toEqual(['WEB_PRODUCT_ENGINEER', 'MOBILE_PRODUCT_ENGINEER']);
  });
});

describe('fromApplicationForm', () => {
  it('서버 지원 폼을 화면 문항으로 되돌린다', () => {
    const request = toApplicationFormRequest(draftWithQuestions());
    const restored = fromApplicationForm({ projectId: 1, ...request });
    expect(restored.sectionEnabled).toEqual({ DESIGN: false, PE: true });
    expect(restored.questions.COMMON[0]).toMatchObject({ type: 'SHORT', title: '지원 동기' });
    expect(restored.questions.PE[0]).toMatchObject({ type: 'SINGLE', required: false });
    expect(restored.questions.PE[0].choices.map(({ label }) => label)).toEqual(['Web', 'Mobile']);
  });

  it('폼이 없으면 빈 문항이다', () => {
    expect(fromApplicationForm(null).questions).toEqual({ COMMON: [], DESIGN: [], PE: [] });
  });
});
