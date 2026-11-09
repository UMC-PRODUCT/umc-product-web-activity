import { describe, expect, it } from 'vitest';

import { renderEditor, serializeEditor } from './boldMarkup';

const serialize = (html: string) => {
  const root = document.createElement('div');
  root.innerHTML = html;
  return serializeEditor(root);
};

describe('serializeEditor', () => {
  it('굵은 글씨는 **로 한 번만 감싼다', () => {
    expect(serialize('<div><b>볼드체</b></div>')).toBe('**볼드체**');
    expect(serialize('<div>가 <strong>나</strong> 다</div>')).toBe('가 **나** 다');
    expect(serialize('<div><span style="font-weight: 700">나</span></div>')).toBe('**나**');
  });

  it('겹친 굵은 요소도 한 번만 감싼다', () => {
    expect(serialize('<div><b>가<strong>나</strong></b></div>')).toBe('**가나**');
  });

  it('굵은 불렛은 불렛을 굵은 구간 밖으로 뺀다', () => {
    expect(serialize('<div><b>· 글</b></div>')).toBe('· **글**');
  });

  it('저장 형식을 다시 그린 뒤 저장해도 같다', () => {
    const root = document.createElement('div');
    renderEditor(root, '가 **나** 다\n· **라**');
    expect(serializeEditor(root)).toBe('가 **나** 다\n· **라**');
  });
});
