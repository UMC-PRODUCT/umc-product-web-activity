import { toGisuYears } from './gisuYears';

describe('toGisuYears', () => {
  it('서버가 문자열로 준 기수 ID를 숫자로 맞추고 시작일의 연도를 쓴다', () => {
    const years = toGisuYears({
      gisus: [{ gisuId: '8', startAt: '2026-03-01T00:00:00Z' }],
    } as never);

    expect(years.get(8)).toBe('2026');
  });

  it('연도는 한국 시간 기준이다', () => {
    const years = toGisuYears({ gisus: [{ gisuId: 8, startAt: '2025-12-31T15:00:00Z' }] });

    expect(years.get(8)).toBe('2026');
  });

  it('시작일이 없거나 읽을 수 없는 기수는 뺀다', () => {
    const years = toGisuYears({
      gisus: [{ gisuId: 6 }, { gisuId: 7, startAt: '날짜 아님' }],
    });

    expect(years.size).toBe(0);
  });

  it('기수 목록이 없으면 비어 있다', () => {
    expect(toGisuYears({}).size).toBe(0);
  });
});
