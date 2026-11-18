"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Browser-storage backed state built on `useSyncExternalStore`.
 *
 * - Server render and the first client render use `fallback`, so there is no
 *   hydration mismatch; the stored value appears right after hydration.
 * - Tabs stay in sync through the `storage` event.
 * - If storage is unavailable (private mode, blocked cookies) the value lives
 *   in memory for the session instead of throwing.
 */

type StorageKind = "local" | "session";

type Options<T> = {
  storage?: StorageKind;
  parse?: (raw: string) => T;
  serialize?: (value: T) => string;
};

const listeners = new Map<string, Set<() => void>>();
const memoryFallback = new Map<string, string | null>();
const parsedCache = new Map<string, { raw: string | null; value: unknown }>();

function storageFor(kind: StorageKind): Storage | null {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function cacheKey(kind: StorageKind, key: string) {
  return `${kind}:${key}`;
}

function readRaw(kind: StorageKind, key: string): string | null {
  const id = cacheKey(kind, key);
  if (memoryFallback.has(id)) return memoryFallback.get(id) ?? null;
  try {
    return storageFor(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeRaw(kind: StorageKind, key: string, raw: string | null) {
  const id = cacheKey(kind, key);
  try {
    const storage = storageFor(kind);
    if (!storage) throw new Error("no storage");
    if (raw === null) storage.removeItem(key);
    else storage.setItem(key, raw);
    memoryFallback.delete(id);
  } catch {
    memoryFallback.set(id, raw);
  }
  listeners.get(id)?.forEach((listener) => listener());
}

function subscribeTo(kind: StorageKind, key: string, listener: () => void) {
  const id = cacheKey(kind, key);
  let set = listeners.get(id);
  if (!set) {
    set = new Set();
    listeners.set(id, set);
  }
  set.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === key) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const defaultParse = <T,>(raw: string) => JSON.parse(raw) as T;
const defaultSerialize = <T,>(value: T) => JSON.stringify(value);

export function useStoredState<T>(
  key: string,
  fallback: T,
  options: Options<T> = {},
): [T, (next: T | ((prev: T) => T)) => void] {
  const kind = options.storage ?? "local";
  const parse = options.parse ?? defaultParse<T>;
  const serialize = options.serialize ?? defaultSerialize<T>;

  const getSnapshot = (): T => {
    const raw = readRaw(kind, key);
    const id = cacheKey(kind, key);
    const cached = parsedCache.get(id);
    if (cached && cached.raw === raw) return cached.value as T;

    let value = fallback;
    if (raw !== null) {
      try {
        value = parse(raw);
      } catch {
        value = fallback;
      }
    }
    parsedCache.set(id, { raw, value });
    return value;
  };

  const value = useSyncExternalStore(
    (listener) => subscribeTo(kind, key, listener),
    getSnapshot,
    () => fallback,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const id = cacheKey(kind, key);
      const raw = readRaw(kind, key);
      const cached = parsedCache.get(id);
      let prev: T = fallback;
      if (cached && cached.raw === raw) prev = cached.value as T;
      else if (raw !== null) {
        try {
          prev = parse(raw);
        } catch {
          prev = fallback;
        }
      }
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeRaw(kind, key, resolved === undefined ? null : serialize(resolved));
    },
    // parse/serialize/fallback are expected to be stable per key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, key],
  );

  return [value, setValue];
}

const noopSubscribe = () => () => {};

/** `false` during SSR and the hydration render, `true` afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
