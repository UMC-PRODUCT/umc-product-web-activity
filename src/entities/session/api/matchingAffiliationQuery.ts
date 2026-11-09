import { queryOptions } from '@tanstack/react-query';

import { api } from '@/shared/api/client';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-TRANSFER-001'];
export type MatchingAffiliationResponse = NonNullable<
  Operation['responses'][200]['content']['*/*']
>;

export const matchingAffiliationQueryOptions = (gisuId: number) =>
  queryOptions({
    queryKey: ['matching-affiliation', 'me', gisuId],
    queryFn: () =>
      api.get<MatchingAffiliationResponse>('/api/v1/projects/matching-affiliation/me', { gisuId }),
  });
