// 이름 안의 띄어쓰기 제거 (예: "홍 길동" → "홍길동")
export const compactName = (name: string | undefined | null) => (name ?? '').replace(/\s+/g, '');
