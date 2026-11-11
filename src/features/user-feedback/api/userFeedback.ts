import { api } from '@/shared/api/client';
import type { components, operations } from '@/types/api';

export type FeedbackContext = operations['getTemplate']['parameters']['query']['context'];
export type UserFeedbackTemplate = components['schemas']['GetUserFeedbackTemplateResponse'];
export type FeedbackQuestion = components['schemas']['FeedbackQuestion'];
export type SubmitUserFeedbackRequest = components['schemas']['SubmitUserFeedbackResponseRequest'];
type SubmitUserFeedbackResponse = components['schemas']['UserFeedbackSubmitResponse'];

export const getUserFeedbackTemplate = (context: FeedbackContext) =>
  api.get<UserFeedbackTemplate | null>('/api/v1/user-feedbacks/templates', { context });

export const submitUserFeedback = (body: SubmitUserFeedbackRequest) =>
  api.post<SubmitUserFeedbackResponse>('/api/v1/user-feedbacks/responses', body);
