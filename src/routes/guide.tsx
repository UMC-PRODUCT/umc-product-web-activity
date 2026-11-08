import { createFileRoute } from '@tanstack/react-router';

import GuidePage from './-guide/GuidePage';

export const Route = createFileRoute('/guide')({
  component: GuidePage,
});
