import { useState } from 'react';
import { t } from '@lingui/core/macro';
import { useGameStore } from '../../store/game-store.ts';
import { Button } from '../ui/button.tsx';
import { ContentDialog } from '../ui/content-dialog.tsx';
import { RulesContent } from '../screens/rules-content.tsx';
import { SettingsContent } from '../screens/settings-content.tsx';

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
        <RulesContent />
      </ContentDialog>
    );
  }

  if (menuView === 'settings') {
    return (
      <ContentDialog open title={t`Settings`} onClose={close}>
        <Button variant="ghost" size="sm" onClick={() => setMenuView('menu')}>
          {t`← Back`}
        </Button>
        <SettingsContent />
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

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-text-secondary">{t`Keyboard Shortcuts`}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <tbody className="text-text-secondary">
              <tr className="border-b border-border/50">
                <td className="py-1.5 pr-4">
                  <kbd className="bg-surface px-2 py-0.5 rounded text-xs">{t`← →`}</kbd>
                </td>
                <td className="py-1.5">{t`Navigate hand`}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-1.5 pr-4">
                  <kbd className="bg-surface px-2 py-0.5 rounded text-xs">{t`← → ↑ ↓`}</kbd>
                </td>
                <td className="py-1.5">{t`Navigate board`}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-1.5 pr-4">
                  <kbd className="bg-surface px-2 py-0.5 rounded text-xs">{t`Enter / Space`}</kbd>
                </td>
                <td className="py-1.5">{t`Select / Place`}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-1.5 pr-4">
                  <kbd className="bg-surface px-2 py-0.5 rounded text-xs">{t`Escape`}</kbd>
                </td>
                <td className="py-1.5">{t`Deselect card`}</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-4">
                  <kbd className="bg-surface px-2 py-0.5 rounded text-xs">{t`Tab`}</kbd>
                </td>
                <td className="py-1.5">{t`Move between sections`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </ContentDialog>
  );
}
