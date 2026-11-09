import { formatPersonName } from '@/shared/lib/formatPersonName';

import type { PmCandidate } from './types';

export const getPmLabel = ({ nickname, name, schoolName }: PmCandidate) =>
  `${formatPersonName({ nickname, name })} · ${schoolName}`;
