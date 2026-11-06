import { compactName } from '@/shared/lib/compactName';

import type { PmCandidate } from './types';

export const getPmLabel = ({ nickname, name, schoolName }: PmCandidate) =>
  `${compactName(nickname)}/${compactName(name)} · ${schoolName}`;
