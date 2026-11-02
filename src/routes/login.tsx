import { createFileRoute } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth';

type LoginSearch = { error?: string };

const LoginPage = () => {
  const { error } = Route.useSearch();

  return (
    <main className="flex flex-1 items-center justify-center bg-teal-grey-50 px-4 py-20">
      <LoginForm initialError={error} />
    </main>
  );
};

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: LoginPage,
});
