/**
 * Single source of truth for every localStorage key the client uses.
 * All persisted Zustand stores must reference one of these — see
 * `create-persisted-store.ts`.
 */
export enum StorageKey {
  Settings = 'bloodfang-settings',
  Decks = 'bloodfang-decks', // Phase 1 (deck library)
  MatchHistory = 'bloodfang-history', // Phase 2 (match history)
}
