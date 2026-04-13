import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameMode } from '../game-mode.ts';
import { DEFAULT_LOCALE, type Locale } from '../i18n.ts';
import { Theme } from '../theme.ts';

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
