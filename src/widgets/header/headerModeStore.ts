import { create } from 'zustand';

type HeaderModeState = {
  isDark: boolean;
  setDark: (isDark: boolean) => void;
};

export const useHeaderModeStore = create<HeaderModeState>()((set) => ({
  isDark: false,
  setDark: (isDark) => set({ isDark }),
}));
