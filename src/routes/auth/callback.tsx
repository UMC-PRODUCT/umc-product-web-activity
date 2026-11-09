import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { getSsoClient } from '@/shared/auth/sso-client';
import AuthBusyScreen from '@/shared/ui/AuthBusyScreen';

export const Route = createFileRoute('/auth/callback')({
  component: CallbackPage,
});

function CallbackPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSsoClient()
      .handleCallback(window.location.href)
      .then(
        (result) => {
          if (!cancelled && result.status === 'success') {
            router.history.replace(result.returnTo);
          }
        },
        () => {
          if (!cancelled) setFailed(true);
        },
      );

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (failed) {
    return (
      <main className="flex flex-1 items-center justify-center bg-teal-grey-50 px-4 py-20">
        <p className="text-body-2-regular text-teal-grey-700" role="alert">
          로그인에 실패했어요. 다시 시도해 주세요.
        </p>
      </main>
    );
  }

  return <AuthBusyScreen label="로그인 중" />;
}
