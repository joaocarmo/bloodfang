import { t } from '@lingui/core/macro';

export function RulesContent() {
  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{t`Basic Rules`}</h2>
        <ul className="list-disc list-inside flex flex-col gap-2 text-text-secondary">
          <li>{t`2-player hot-seat game on a 3×5 grid (3 lanes, 5 columns).`}</li>
          <li>{t`Each player builds a 15-card deck before the game begins.`}</li>
          <li>{t`Both players draw a starting hand with an optional mulligan phase.`}</li>
          <li>{t`Players take turns placing a card on the board or passing.`}</li>
          <li>{t`Cards have power, range, rank (1★ / 2★ / 3★ / Replacement), and abilities.`}</li>
          <li>{t`Pawns on tiles determine control. Each lane's score is the sum of card power.`}</li>
          <li>{t`The player with the higher lane score wins that lane. Win the most lanes to win the game.`}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{t`Keyboard Shortcuts`}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-text-secondary font-medium">{t`Key`}</th>
                <th className="py-2 text-text-secondary font-medium">{t`Action`}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">
                  <kbd className="bg-surface-raised px-2 py-0.5 rounded text-sm">{t`← →`}</kbd>
                </td>
                <td className="py-2">{t`Navigate hand`}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">
                  <kbd className="bg-surface-raised px-2 py-0.5 rounded text-sm">{t`← → ↑ ↓`}</kbd>
                </td>
                <td className="py-2">{t`Navigate board`}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">
                  <kbd className="bg-surface-raised px-2 py-0.5 rounded text-sm">{t`Enter / Space`}</kbd>
                </td>
                <td className="py-2">{t`Select card or place on tile`}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">
                  <kbd className="bg-surface-raised px-2 py-0.5 rounded text-sm">{t`Escape`}</kbd>
                </td>
                <td className="py-2">{t`Deselect card`}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">
                  <kbd className="bg-surface-raised px-2 py-0.5 rounded text-sm">{t`Tab`}</kbd>
                </td>
                <td className="py-2">{t`Move between sections`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
