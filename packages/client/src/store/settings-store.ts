import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Locale, DEFAULT_LOCALE } from '../i18n.ts';
import { Theme } from '../theme.ts';
import { GameMode } from '../game-mode.ts';

interface SettingsStore {
  locale: Locale;
  theme: Theme;
  gameMode: GameMode;
  showActionLog: boolean;

  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  setGameMode: (mode: GameMode) => void;
  setShowActionLog: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      theme: Theme.Dark,
      gameMode: GameMode.PvpLocal,
      showActionLog: false,

      setLocale: (locale) => set({ locale }),
      setTheme: (theme) => set({ theme }),
      setGameMode: (gameMode) => set({ gameMode }),
      setShowActionLog: (show) => set({ showActionLog: show }),
    }),
    { name: 'bloodfang-settings' },
  ),
);
