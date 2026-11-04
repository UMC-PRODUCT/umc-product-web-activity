import { createQuestion } from './draft';
import { parseQuestion, serializeQuestion } from './questionClipboard';

describe('questionClipboard', () => {
  it('복사한 문항을 그대로 되돌린다 (ID는 비워 둠)', () => {
    const question = { ...createQuestion('SINGLE'), title: '선호 파트', required: false };
    question.choices = [
      { id: 'a', label: 'Web' },
      { id: 'b', label: 'Mobile' },
    ];

    expect(parseQuestion(serializeQuestion(question))).toEqual({
      id: '',
      type: 'SINGLE',
      title: '선호 파트',
      description: '',
      required: false,
      choices: [
        { id: '', label: 'Web' },
        { id: '', label: 'Mobile' },
      ],
    });
  });

  it('일반 텍스트나 깨진 값은 문항으로 보지 않는다', () => {
    expect(parseQuestion('그냥 텍스트')).toBeNull();
    expect(parseQuestion('umc-project-question:{깨짐')).toBeNull();
    expect(parseQuestion('umc-project-question:{"title":"a","type":"X","choices":[]}')).toBeNull();
  });
});
