import { create, type StateCreator } from 'zustand';
import { type PersistOptions, persist } from 'zustand/middleware';
import type { StorageKey } from './storage-keys.ts';

interface CreatePersistedStoreOptions<State, PersistedKeys extends keyof State> {
  /** Storage key — must be a member of the `StorageKey` enum. */
  name: StorageKey;
  /** Schema version. Bump and add a `migrate` branch whenever the persisted shape changes. */
  version: number;
  /** Keys to persist. Action functions are dropped automatically by omission. */
  persistKeys: readonly PersistedKeys[];
  /** Migrate older payloads to the current shape. Return `state` unchanged for `version === current`. */
  migrate: (persistedState: unknown, fromVersion: number) => Pick<State, PersistedKeys>;
}

/**
 * Thin wrapper around `zustand/persist` that enforces the project's persistence conventions:
 *  - Storage key is typed against the `StorageKey` enum.
 *  - A `version` and explicit `migrate` are required (no silent migrations).
 *  - `persistKeys` drives `partialize`, so action functions never get serialized.
 */
export function createPersistedStore<State extends object, PersistedKeys extends keyof State>(
  options: CreatePersistedStoreOptions<State, PersistedKeys>,
) {
  const { name, version, persistKeys, migrate } = options;

  const persistOptions: PersistOptions<State, Pick<State, PersistedKeys>> = {
    name,
    version,
    partialize: (state) => {
      const picked = {} as Pick<State, PersistedKeys>;
      for (const key of persistKeys) {
        picked[key] = state[key];
      }
      return picked;
    },
    migrate: (persisted, from) => migrate(persisted, from) as State,
  };

  return (initializer: StateCreator<State>) =>
    create<State>()(persist(initializer, persistOptions));
}
