"use client";

import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/types";
import {
  translate,
  type MessageKey,
} from "@/lib/i18n/messages";
import { useHydrated, useStoredState } from "@/lib/hooks/useStoredState";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  hydrated: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function parseLocale(raw: string): Locale {
  return raw === "en" || raw === "el" ? raw : DEFAULT_LOCALE;
}

function serializeLocale(locale: Locale): string {
  return locale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useStoredState<Locale>(
    LOCALE_STORAGE_KEY,
    DEFAULT_LOCALE,
    { parse: parseLocale, serialize: serializeLocale },
  );
  const hydrated = useHydrated();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
    },
    [setLocaleState],
  );

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "el" ? "en" : "el"));
  }, [setLocaleState]);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
      hydrated,
    }),
    [locale, setLocale, toggleLocale, t, hydrated],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
