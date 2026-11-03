import type { Notice } from '../model/types';
import { sortNotices } from './sortNotices';

const notice = (id: string, createdAt: string, required = false): Notice => ({
  id,
  kind: 'TEAM_MATCHING',
  chapterId: 'axolotl',
  title: id,
  content: '',
  createdAt,
  required,
  authorLabel: 'UMC PRODUCT',
});

describe('sortNotices', () => {
  it('최신순으로 정렬한다', () => {
    const result = sortNotices([notice('old', '2026-04-01'), notice('new', '2026-04-17')]);

    expect(result.map((item) => item.id)).toEqual(['new', 'old']);
  });

  it('필독 공지를 맨 위에 두고 필독끼리도 최신순으로 정렬한다', () => {
    const result = sortNotices([
      notice('normal-new', '2026-04-20'),
      notice('required-old', '2026-04-01', true),
      notice('required-new', '2026-04-10', true),
    ]);

    expect(result.map((item) => item.id)).toEqual(['required-new', 'required-old', 'normal-new']);
  });

  it('기본 공지는 안내사항을 필독 위에, 자주 질문·문의 안내를 맨 아래에 둔다', () => {
    const hardcoded = (id: string, required: boolean): Notice => ({
      ...notice(id, '2026-11-10', required),
      hardcoded: true,
    });

    const result = sortNotices([
      hardcoded('faq', false),
      hardcoded('service-guide', false),
      notice('normal-old', '2026-04-01'),
      notice('normal-new', '2026-04-20'),
      notice('required-old', '2026-04-02', true),
      notice('required-new', '2026-04-10', true),
      hardcoded('guide', true),
    ]);

    expect(result.map((item) => item.id)).toEqual([
      'guide',
      'required-new',
      'required-old',
      'normal-new',
      'normal-old',
      'faq',
      'service-guide',
    ]);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const notices = [notice('old', '2026-04-01'), notice('new', '2026-04-17')];

    sortNotices(notices);

    expect(notices.map((item) => item.id)).toEqual(['old', 'new']);
  });
});
