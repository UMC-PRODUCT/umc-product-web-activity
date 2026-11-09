import { isAuthEndpoint } from '@umc-product/auth-client';
import type { InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError, isAxiosError } from 'axios';

import { getSsoClient } from '@/shared/auth/sso-client';

import { getAccessToken } from './authToken';

export interface ApiResponse<T> {
  success?: boolean;
  code?: string;
  message?: string;
  result?: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  // 배열 쿼리를 서버(Spring) 형식 ?parts=A&parts=B 로 보냄 (기본값은 parts[]=A)
  paramsSerializer: { indexes: null },
});

apiClient.interceptors.request.use((config) => {
  if (config.skipAuth) {
    delete config.headers.Authorization;
    return config;
  }
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!isAxiosError(error) || error.response?.status !== 401) {
    return Promise.reject(toApiError(error));
  }

  const config = error.config;
  if (!config || isAuthEndpoint(requestUrl(config)) || config._retry) {
    return Promise.reject(toApiError(error));
  }

  config._retry = true;
  try {
    const accessToken = await getSsoClient().recoverFromUnauthorized();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient.request(config);
  } catch (renewError) {
    return Promise.reject(toApiError(renewError));
  }
});

const requestUrl = (config: InternalAxiosRequestConfig) => {
  const baseURL = config.baseURL ?? '';
  return `${baseURL}${config.url ?? ''}`;
};

const toApiError = (error: unknown) => {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    const status = axiosError.response?.status ?? 0;
    const body = axiosError.response?.data;
    return new ApiError(
      status,
      body?.code ?? (status === 0 ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR'),
      body?.message ?? '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
  }

  if (error instanceof Error) {
    return new ApiError(0, 'UNKNOWN_ERROR', error.message);
  }

  return new ApiError(0, 'UNKNOWN_ERROR', '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.');
};

const unwrap = <T>(body: ApiResponse<T>, status: number): T => {
  if (body.success === false) {
    throw new ApiError(status, body.code ?? 'UNKNOWN_ERROR', body.message ?? '요청에 실패했어요.');
  }
  return body.result as T;
};

export const api = {
  get: async <T>(url: string, params?: object) => {
    const res = await apiClient.get<ApiResponse<T>>(url, { params });
    return unwrap(res.data, res.status);
  },
  post: async <T>(url: string, body?: unknown) => {
    const res = await apiClient.post<ApiResponse<T>>(url, body);
    return unwrap(res.data, res.status);
  },
  put: async <T>(url: string, body?: unknown) => {
    const res = await apiClient.put<ApiResponse<T>>(url, body);
    return unwrap(res.data, res.status);
  },
  patch: async <T>(url: string, body?: unknown) => {
    const res = await apiClient.patch<ApiResponse<T>>(url, body);
    return unwrap(res.data, res.status);
  },
  delete: async <T>(url: string) => {
    const res = await apiClient.delete<ApiResponse<T>>(url);
    return unwrap(res.data, res.status);
  },
};
