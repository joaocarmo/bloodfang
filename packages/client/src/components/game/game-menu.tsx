import { useState } from 'react';
import { t } from '@lingui/core/macro';
import { useGameStore } from '../../store/game-store.ts';
import { Button } from '../ui/button.tsx';
import { ContentDialog } from '../ui/content-dialog.tsx';
import { RulesContent, BasicRules, KeyboardShortcuts } from '../screens/rules-content.tsx';
import { SettingsContent, LanguageSetting, ThemeSetting } from '../screens/settings-content.tsx';

type MenuView = 'closed' | 'menu' | 'rules' | 'settings';

export function GameMenu() {
  const [menuView, setMenuView] = useState<MenuView>('closed');
  const setShowExitConfirm = useGameStore((s) => s.setShowExitConfirm);

  const close = () => setMenuView('closed');

  if (menuView === 'closed') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMenuView('menu')}
        aria-label={t`Game menu`}
      >
        ☰
      </Button>
    );
  }

  if (menuView === 'rules') {
    return (
      <ContentDialog open title={t`Rules`} onClose={close}>
        <Button variant="ghost" size="sm" onClick={() => setMenuView('menu')}>
          {t`← Back`}
        </Button>
        <RulesContent>
          <BasicRules />
        </RulesContent>
      </ContentDialog>
    );
  }

  if (menuView === 'settings') {
    return (
      <ContentDialog open title={t`Settings`} onClose={close}>
        <Button variant="ghost" size="sm" onClick={() => setMenuView('menu')}>
          {t`← Back`}
        </Button>
        <SettingsContent>
          <LanguageSetting />
          <ThemeSetting />
        </SettingsContent>
      </ContentDialog>
    );
  }

  // menuView === 'menu'
  return (
    <ContentDialog open title={t`Menu`} onClose={close}>
      <nav className="flex flex-col gap-3">
        <Button onClick={() => setMenuView('rules')}>{t`Rules`}</Button>
        <Button onClick={() => setMenuView('settings')}>{t`Settings`}</Button>
        <Button
          variant="danger"
          onClick={() => {
            close();
            setShowExitConfirm(true);
          }}
        >
          {t`Exit Game`}
        </Button>
      </nav>

      <KeyboardShortcuts />
    </ContentDialog>
  );
}
