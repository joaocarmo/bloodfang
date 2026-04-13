import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useGame } from '../../context/game-context.tsx';
import { Route } from '../../routes.ts';
import { BasicRules, KeyboardShortcuts, RulesContent } from '../screens/rules-content.tsx';
import {
  ActionLogSetting,
  LanguageSetting,
  SettingsContent,
  ThemeSetting,
} from '../screens/settings-content.tsx';
import { Button } from '../ui/button.tsx';
import { ContentDialog } from '../ui/content-dialog.tsx';

type MenuView = 'closed' | 'menu' | 'rules' | 'settings';

export function GameMenu() {
  const [menuView, setMenuView] = useState<MenuView>('closed');
  const navigate = useNavigate();
  const { resetToHome } = useGame();

  const close = () => {
    setMenuView('closed');
  };

  if (menuView === 'closed') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setMenuView('menu');
        }}
        aria-label={t`Game menu`}
      >
        ☰
      </Button>
    );
  }

  if (menuView === 'rules') {
    return (
      <ContentDialog open title={t`Rules`} onClose={close}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMenuView('menu');
          }}
        >
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMenuView('menu');
          }}
        >
          {t`← Back`}
        </Button>
        <SettingsContent>
          <ActionLogSetting />
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
        <Button
          onClick={() => {
            setMenuView('rules');
          }}
        >{t`Rules`}</Button>
        <Button
          onClick={() => {
            setMenuView('settings');
          }}
        >{t`Settings`}</Button>
        <Button
          variant="danger"
          onClick={() => {
            close();
            resetToHome();
            void navigate({ to: Route.Home });
          }}
        >
          {t`Exit Game`}
        </Button>
      </nav>

      <KeyboardShortcuts />
    </ContentDialog>
  );
}
