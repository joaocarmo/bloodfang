import { GameMode } from '../game-mode.ts';
import { DEFAULT_LOCALE, type Locale } from '../i18n.ts';
import { Theme } from '../theme.ts';
import { createPersistedStore } from './create-persisted-store.ts';
import { StorageKey } from './storage-keys.ts';

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

type PersistedSettings = Pick<SettingsStore, 'locale' | 'theme' | 'gameMode' | 'showActionLog'>;

const DEFAULTS: PersistedSettings = {
  locale: DEFAULT_LOCALE,
  theme: Theme.Dark,
  gameMode: GameMode.PvpLocal,
  showActionLog: false,
};

export const useSettingsStore = createPersistedStore<SettingsStore, keyof PersistedSettings>({
  name: StorageKey.Settings,
  version: 1,
  persistKeys: ['locale', 'theme', 'gameMode', 'showActionLog'],
  migrate: (persisted, _from) => ({ ...DEFAULTS, ...(persisted as Partial<PersistedSettings>) }),
})((set) => ({
  ...DEFAULTS,
  setLocale: (locale) => set({ locale }),
  setTheme: (theme) => set({ theme }),
  setGameMode: (gameMode) => set({ gameMode }),
  setShowActionLog: (show) => set({ showActionLog: show }),
}));
