import { formatPersonName } from './formatPersonName';

describe('formatPersonName', () => {
  it('닉네임/이름으로 표시한다', () => {
    expect(formatPersonName({ nickname: '솔', name: '박은솔' })).toBe('솔/박은솔');
  });

  it('성과 이름이 띄어져 있으면 붙인다', () => {
    expect(formatPersonName({ nickname: '솔', name: '박 은솔' })).toBe('솔/박은솔');
    expect(formatPersonName({ nickname: '솔', name: ' 박  은 솔 ' })).toBe('솔/박은솔');
  });

  it('없는 값은 빼고 표시한다', () => {
    expect(formatPersonName({ name: '박 은솔' })).toBe('박은솔');
    expect(formatPersonName({ nickname: '솔', name: null })).toBe('솔');
    expect(formatPersonName(undefined)).toBe('');
  });
});
