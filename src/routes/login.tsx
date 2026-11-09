import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { LoginForm } from '@/features/auth';
import { getSsoClient } from '@/shared/auth/sso-client';
import { HOME_PATH } from '@/shared/config/teamMatchingMenu';
import AuthBusyScreen from '@/shared/ui/AuthBusyScreen';

type LoginSearch = {
  error?: string;
  redirect?: string;
};

const isSafeRedirect = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

const LoginPage = () => {
  const { error, redirect: redirectTo } = Route.useSearch();
  const returnTo = redirectTo ?? HOME_PATH;
  const [phase, setPhase] = useState<'checking' | 'form' | 'error'>('checking');

  useEffect(() => {
    const client = getSsoClient();

    if (client.config.loginMode === 'auth-app') {
      void client.startLogin(returnTo);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const signedIn = await client.hasSsoSession();
        if (cancelled) return;
        if (signedIn) {
          await client.startLogin(returnTo);
          return;
        }
        setPhase('form');
      } catch {
        if (!cancelled) setPhase('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [returnTo]);

  if (phase === 'form') {
    return (
      <main className="flex flex-1 items-center justify-center bg-teal-grey-50 px-4 py-20">
        <LoginForm initialError={error} returnTo={returnTo} />
      </main>
    );
  }

  if (phase === 'error') {
    return (
      <main className="flex flex-1 items-center justify-center bg-teal-grey-50 px-4 py-20">
        <p className="text-body-2-regular text-teal-grey-700" role="alert">
          로그인 상태를 확인하지 못했어요.
        </p>
      </main>
    );
  }

  return <AuthBusyScreen label="로그인 중" />;
};

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    error: typeof search.error === 'string' ? search.error : undefined,
    redirect: isSafeRedirect(search.redirect) ? search.redirect : undefined,
  }),
  component: LoginPage,
});
