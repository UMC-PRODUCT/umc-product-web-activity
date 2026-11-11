import { create } from 'zustand';

type FeedbackModalState = {
  open: boolean;
  waitingProjectModalClose: boolean;
  show: () => void;
  showAfter: (delayMs: number) => void;
  hide: () => void;
  waitProjectModalClose: () => void;
  cancel: () => void;
};

let showTimer: ReturnType<typeof setTimeout> | undefined;

export const useFeedbackModalStore = create<FeedbackModalState>()((set) => ({
  open: false,
  waitingProjectModalClose: false,
  show: () => {
    clearTimeout(showTimer);
    set({ open: true, waitingProjectModalClose: false });
  },
  showAfter: (delayMs) => {
    clearTimeout(showTimer);
    set({ waitingProjectModalClose: false });
    showTimer = setTimeout(() => set({ open: true }), delayMs);
  },
  hide: () => {
    clearTimeout(showTimer);
    set({ open: false });
  },
  waitProjectModalClose: () => {
    clearTimeout(showTimer);
    set({ waitingProjectModalClose: true });
  },
  cancel: () => {
    clearTimeout(showTimer);
    set({ open: false, waitingProjectModalClose: false });
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => useFeedbackModalStore.getState().cancel());
}
