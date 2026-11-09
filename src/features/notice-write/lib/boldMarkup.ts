import { splitBoldSegments } from '@/entities/notice';

import { BULLET } from './bullet';

const MARK = '**';

const isBoldElement = (node: Node): node is HTMLElement =>
  node instanceof HTMLElement &&
  (node.tagName === 'STRONG' ||
    node.tagName === 'B' ||
    Number(node.style.fontWeight) >= 600 ||
    node.style.fontWeight === 'bold');

// 한 줄 안의 노드를 저장 형식으로 바꿈: 굵은 글씨는 **로 감싼다
const serializeInline = (node: Node, bold: boolean): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    // 편집 영역이 끝 공백을 줄바꿈 없는 공백으로 바꾸는 경우가 있어 일반 공백으로 되돌린다
    const text = (node.textContent ?? '').replace(/\xa0/g, ' ');
    return text;
  }
  if (node.nodeName === 'BR') return '';

  // 굵은 구간 안에서는 안쪽 글자를 먼저 이어 붙인 뒤 한 번만 감싼다
  if (!bold && isBoldElement(node)) {
    const inner = Array.from(node.childNodes)
      .map((child) => serializeInline(child, true))
      .join('');
    return inner ? `${MARK}${inner}${MARK}` : '';
  }
  return Array.from(node.childNodes)
    .map((child) => serializeInline(child, bold))
    .join('');
};

const isBlock = (node: Node) =>
  node instanceof HTMLElement && (node.tagName === 'DIV' || node.tagName === 'P');

// 편집 영역 → 저장 형식. 줄(div)마다 \n으로 잇고, 굵은 구간은 **로 감싼다
export const serializeEditor = (root: HTMLElement): string => {
  const lines: string[] = [];
  let inlineBuffer: Node[] = [];

  const flushInline = () => {
    if (inlineBuffer.length === 0) return;
    lines.push(inlineBuffer.map((node) => serializeInline(node, false)).join(''));
    inlineBuffer = [];
  };

  const walk = (parent: Node) => {
    parent.childNodes.forEach((child) => {
      if (!isBlock(child)) {
        inlineBuffer.push(child);
        return;
      }
      flushInline();
      if (Array.from(child.childNodes).some(isBlock)) walk(child);
      else lines.push(serializeInline(child, false));
    });
    flushInline();
  };

  walk(root);
  // 굵은 불렛('**· 글**')은 목록에서 불렛으로 알아볼 수 있게 불렛을 굵은 구간 밖으로 뺀다
  const boldBullet = `${MARK}${BULLET}`;
  return lines
    .map((line) =>
      line.startsWith(boldBullet) ? `${BULLET}${MARK}${line.slice(boldBullet.length)}` : line,
    )
    .join('\n');
};

// 저장 형식 → 편집 영역. 줄마다 div, **굵게** 구간은 strong
export const renderEditor = (root: HTMLElement, value: string) => {
  const fragment = document.createDocumentFragment();

  value.split('\n').forEach((line) => {
    const row = document.createElement('div');
    if (line === '') {
      row.append(document.createElement('br'));
    } else {
      splitBoldSegments(line).forEach(({ text, bold }) => {
        if (bold) {
          const strong = document.createElement('strong');
          strong.className = 'font-bold';
          strong.textContent = text;
          row.append(strong);
        } else {
          row.append(text);
        }
      });
    }
    fragment.append(row);
  });

  root.replaceChildren(fragment);
};
