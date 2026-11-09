export type BoldSegment = { text: string; bold: boolean };

const MARK = '**';

// 한 줄의 **굵게** 표식을 짝으로 나눈다. 표식이 서로 붙어 있거나(****) 짝이 맞지 않아도 표식이 글자로 남지 않는다
export const splitBoldSegments = (line: string): BoldSegment[] => {
  let bold = false;
  const segments: BoldSegment[] = [];
  line.split(MARK).forEach((text, index) => {
    if (index > 0) bold = !bold;
    if (text) segments.push({ text, bold });
  });
  return segments;
};
