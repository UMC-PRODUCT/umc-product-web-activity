import { useQuery } from '@tanstack/react-query';

import { useApplicationsView, useSessionStore } from '@/entities/session';
import { api } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';
import type { operations } from '@/types/api';

type Operation = operations['PROJECT-TRANSFER-001'];
type MatchingAffiliationResponse = NonNullable<Operation['responses'][200]['content']['*/*']>;

const getMatchingAffiliation = (gisuId: number) =>
  api.get<MatchingAffiliationResponse>('/api/v1/projects/matching-affiliation/me', { gisuId });

export const useMatchingChapterId = (): number | null | undefined => {
  const { gisuId, serverChapterId } = useSessionStore((state) => state.session);
  const isChallenger = useApplicationsView() === 'CHALLENGER';

  const affiliation = useQuery({
    queryKey: ['matching-affiliation', 'me', gisuId],
    queryFn: () => getMatchingAffiliation(gisuId as number),
    enabled: isChallenger && gisuId !== null,
  });

  if (!isChallenger || gisuId === null) return serverChapterId;
  if (affiliation.isPending) return undefined;
  if (affiliation.isError) return serverChapterId;
  return toId(affiliation.data.matchingChapter?.id) ?? null;
};
