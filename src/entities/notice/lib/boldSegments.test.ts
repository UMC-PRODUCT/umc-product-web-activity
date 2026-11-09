import { describe, expect, it } from 'vitest';

import { splitBoldSegments } from './boldSegments';

describe('splitBoldSegments', () => {
  it('굵은 구간과 일반 구간을 나눈다', () => {
    expect(splitBoldSegments('가 **나** 다')).toEqual([
      { text: '가 ', bold: false },
      { text: '나', bold: true },
      { text: ' 다', bold: false },
    ]);
  });

  it('붙어 있는 굵은 구간에서도 표식이 글자로 남지 않는다', () => {
    expect(splitBoldSegments('**가****나**')).toEqual([
      { text: '가', bold: true },
      { text: '나', bold: true },
    ]);
  });

  it('짝이 맞지 않는 표식도 글자로 남지 않는다', () => {
    expect(splitBoldSegments('가 **나')).toEqual([
      { text: '가 ', bold: false },
      { text: '나', bold: true },
    ]);
  });
});
