import {
  type AnswerDrafts,
  type ApplyFormSection,
  getCommonSections,
  getPartSections,
  isSectionsComplete,
  toAnswerItems,
} from './applyForm';

const sections: ApplyFormSection[] = [
  {
    sectionId: 1,
    type: 'COMMON',
    title: '공통 문항',
    orderNo: 1,
    questions: [
      { questionId: 10, type: 'SHORT_TEXT', title: '이름', isRequired: true, options: [] },
      { questionId: 11, type: 'LONG_TEXT', title: '하고 싶은 말', isRequired: false, options: [] },
    ],
  },
  {
    sectionId: 2,
    type: 'PART',
    title: 'Design',
    orderNo: 2,
    allowedParts: ['DESIGN'],
    questions: [
      {
        questionId: 20,
        type: 'CHECKBOX',
        title: '기술 스택',
        isRequired: true,
        options: [
          { optionId: 200, content: 'Figma' },
          { optionId: 201, content: 'illustration' },
        ],
      },
      { questionId: 21, type: 'PORTFOLIO', title: '포트폴리오', isRequired: true, options: [] },
    ],
  },
  {
    sectionId: 3,
    type: 'PART',
    title: 'Web',
    orderNo: 3,
    allowedParts: ['WEB_PRODUCT_ENGINEER'],
    questions: [],
  },
];

describe('getCommonSections · getPartSections', () => {
  it('공통 문항과 내 파트 문항을 나눈다', () => {
    expect(getCommonSections(sections).map(({ sectionId }) => sectionId)).toEqual([1]);
    expect(getPartSections(sections, 'DESIGN').map(({ sectionId }) => sectionId)).toEqual([2]);
    expect(getPartSections(sections, 'WEB_PE').map(({ sectionId }) => sectionId)).toEqual([3]);
  });

  it('파트를 모르면 파트 문항이 없다', () => {
    expect(getPartSections(sections, null)).toEqual([]);
  });
});

describe('isSectionsComplete', () => {
  it('필수 문항이 비어 있으면 미완성', () => {
    expect(isSectionsComplete([sections[0]], {})).toBe(false);
    expect(
      isSectionsComplete([sections[0]], { 10: { text: '  ', optionIds: [], file: null } }),
    ).toBe(false);
  });

  it('선택 문항은 비어 있어도 된다', () => {
    const drafts: AnswerDrafts = { 10: { text: '아람', optionIds: [], file: null } };
    expect(isSectionsComplete([sections[0]], drafts)).toBe(true);
  });

  it('체크박스는 하나 이상, 파일은 업로드가 있어야 채워진 것', () => {
    const drafts: AnswerDrafts = {
      20: { text: '', optionIds: [200], file: null },
      21: { text: '', optionIds: [], file: null },
    };
    expect(isSectionsComplete([sections[1]], drafts)).toBe(false);
    drafts[21] = { text: '', optionIds: [], file: { fileId: 'f1', name: 'a.pdf' } };
    expect(isSectionsComplete([sections[1]], drafts)).toBe(true);
  });
});

describe('toAnswerItems', () => {
  it('문항 종류에 맞는 칸만 보내고 비어 있는 문항은 뺀다', () => {
    const drafts: AnswerDrafts = {
      10: { text: '아람', optionIds: [], file: null },
      20: { text: '', optionIds: [200, 201], file: null },
      21: { text: '', optionIds: [], file: { fileId: 'f1', name: 'a.pdf' } },
    };

    expect(toAnswerItems(sections, drafts)).toEqual([
      { questionId: 10, textValue: '아람' },
      { questionId: 20, selectedOptionIds: [200, 201] },
      { questionId: 21, fileIds: ['f1'] },
    ]);
  });

  it('포트폴리오는 파일 없이 링크만 적어도 채운 것이고, 링크는 textValue로 보낸다', () => {
    const drafts: AnswerDrafts = {
      20: { text: '', optionIds: [200], file: null },
      21: { text: ' https://example.com/portfolio ', optionIds: [], file: null },
    };

    expect(isSectionsComplete([sections[1]], drafts)).toBe(true);
    expect(toAnswerItems([sections[1]], drafts)).toEqual([
      { questionId: 20, selectedOptionIds: [200] },
      { questionId: 21, textValue: 'https://example.com/portfolio' },
    ]);
  });

  it('파일과 링크가 둘 다 있으면 파일을 보낸다', () => {
    const drafts: AnswerDrafts = {
      21: { text: 'https://example.com', optionIds: [], file: { fileId: 'f1', name: 'a.pdf' } },
    };

    expect(toAnswerItems([sections[1]], drafts)).toEqual([{ questionId: 21, fileIds: ['f1'] }]);
  });
});
