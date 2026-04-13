import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPersistedStore } from './create-persisted-store.ts';
import { StorageKey } from './storage-keys.ts';

interface SampleState {
  count: number;
  label: string;
  increment: () => void;
}

const STORAGE_KEY = StorageKey.Settings;

const buildStore = (
  overrides?: Partial<Parameters<typeof createPersistedStore<SampleState, 'count' | 'label'>>[0]>,
) =>
  createPersistedStore<SampleState, 'count' | 'label'>({
    name: STORAGE_KEY,
    version: 1,
    persistKeys: ['count', 'label'],
    migrate: (state) => state as Pick<SampleState, 'count' | 'label'>,
    ...overrides,
  })((set) => ({
    count: 0,
    label: 'initial',
    increment: () => set((s) => ({ count: s.count + 1 })),
  }));

describe('createPersistedStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('rehydrates persisted data fields from storage', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { count: 7, label: 'restored' }, version: 1 }),
    );

    const useStore = buildStore();
    await useStore.persist.rehydrate();

    expect(useStore.getState().count).toBe(7);
    expect(useStore.getState().label).toBe('restored');
  });

  it('partializes out function fields when persisting', () => {
    const useStore = buildStore();
    useStore.getState().increment();

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string) as { state: Record<string, unknown>; version: number };
    expect(parsed.version).toBe(1);
    expect(parsed.state).toEqual({ count: 1, label: 'initial' });
    expect(parsed.state).not.toHaveProperty('increment');
  });

  it('invokes migrate when stored version is older and uses the result', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { count: 99 /* no label — old shape */ }, version: 0 }),
    );

    const migrate = vi.fn((persisted: unknown, from: number) => {
      const old = persisted as { count?: number };
      return { count: old.count ?? 0, label: `migrated-from-v${from}` };
    });

    const useStore = buildStore({ version: 1, migrate });
    await useStore.persist.rehydrate();

    expect(migrate).toHaveBeenCalledWith({ count: 99 }, 0);
    expect(useStore.getState()).toMatchObject({ count: 99, label: 'migrated-from-v0' });
  });
});
