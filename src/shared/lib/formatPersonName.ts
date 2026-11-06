// 챌린저 · PM 이름을 '닉네임/이름'으로 표시
// 서버가 성과 이름을 띄어서 줄 때가 있어서(예: 박 은솔) 이름은 붙여서 보여 줌
export const formatPersonName = ({
  nickname,
  name,
}: { nickname?: string | null; name?: string | null } = {}): string =>
  [nickname?.trim(), name?.replace(/\s+/g, '')].filter(Boolean).join('/');
