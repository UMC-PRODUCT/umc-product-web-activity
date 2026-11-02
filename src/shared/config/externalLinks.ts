// 서비스 밖으로 나가는 링크 주소 (주소가 바뀌면 여기만 고침)
// 빈 문자열이면 아직 정해지지 않은 주소라, 쓰는 쪽에서 눌러도 아무 일 없게 처리
export const EXTERNAL_LINKS = {
  inquiry: 'http://pf.kakao.com/_MDxhqX', // 헤더 문의사항
} as const;

// 새 탭으로 열고, 열린 페이지가 이 탭에 접근하지 못하게 noopener
export const openExternalLink = (url: string) => {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
};
