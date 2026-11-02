import { toNotice } from './toNotice';

describe('toNotice', () => {
  it('서버 공지를 화면 공지로 바꾸고 작성자는 소속 · 역할 · 닉네임/이름으로 만든다', () => {
    expect(
      toNotice(
        {
          id: 12,
          title: '팀 매칭 안내',
          content: '내용',
          mustRead: true,
          createdAt: '2026-11-02T01:00:00Z',
          author: {
            nickname: '윰씨',
            name: '김유앤',
            organizationName: '수달',
            roleName: '지부장',
          },
        },
        'TEAM_MATCHING',
        3,
      ),
    ).toEqual({
      id: '12',
      kind: 'TEAM_MATCHING',
      chapterId: '3',
      title: '팀 매칭 안내',
      content: '내용',
      createdAt: '2026-11-02',
      required: true,
      authorLabel: '수달 지부장 윰씨/김유앤',
    });
  });

  it('작성 시각은 한국 날짜 기준이다', () => {
    expect(toNotice({ createdAt: '2026-11-02T16:00:00Z' }, 'TEAM_MATCHING', 1).createdAt).toBe(
      '2026-11-03',
    );
  });

  it('역할 정보가 없으면 이름만 보여주고 필독이 없으면 아니다', () => {
    const notice = toNotice(
      { id: 1, authorNickname: '윰씨', authorName: '김유앤' },
      'PROJECT_SETTINGS',
      1,
    );

    expect(notice.authorLabel).toBe('윰씨/김유앤');
    expect(notice.required).toBe(false);
  });
});
