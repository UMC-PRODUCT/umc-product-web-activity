import { type ReactNode, useMemo } from 'react';

import { useAppToast } from '@/widgets/toast';

type ShowOptions = Parameters<ReturnType<typeof useAppToast>['show']>[1];

export const useOneLineToast = () => {
  const toast = useAppToast();

  return useMemo(
    () => ({
      ...toast,
      show: (message: ReactNode, options?: ShowOptions) =>
        toast.show(<span className="toast-nowrap">{message}</span>, options),
    }),
    [toast],
  );
};
