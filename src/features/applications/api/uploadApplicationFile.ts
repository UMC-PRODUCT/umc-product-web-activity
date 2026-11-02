import { api, ApiError } from '@/shared/api/client';
import type { components } from '@/types/api';

type PrepareUploadResponse = components['schemas']['PrepareUploadResponse'];

const UPLOAD_FAILED = '파일을 올리지 못했어요. 잠시 후 다시 시도해 주세요.';

// 1) 업로드 주소 받기 → 2) 파일을 그 주소로 올리기 → 3) 업로드 완료 등록. 답변에 붙일 fileId를 돌려줌
// 파일 올리기는 서버 API가 아니라 스토리지로 직접 가는 요청이라 인증 헤더가 붙는 apiClient를 쓰지 않음
export const uploadApplicationFile = async (file: File) => {
  const { fileId, uploadUrl, uploadMethod, headers } = await api.post<PrepareUploadResponse>(
    '/api/v1/storage/prepare-upload',
    {
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      category: 'PORTFOLIO',
    },
  );
  if (!fileId || !uploadUrl) throw new ApiError(0, 'UPLOAD_FAILED', UPLOAD_FAILED);

  const response = await fetch(uploadUrl, {
    method: uploadMethod ?? 'PUT',
    headers: { 'Content-Type': file.type, ...(headers as Record<string, string> | undefined) },
    body: file,
  }).catch(() => null);
  if (!response?.ok) throw new ApiError(response?.status ?? 0, 'UPLOAD_FAILED', UPLOAD_FAILED);

  await api.post<unknown>(`/api/v1/storage/${fileId}/confirm`);
  return fileId;
};
