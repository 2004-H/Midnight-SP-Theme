import { useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

const STORAGE_KEY = 'nm-theme-preference';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return true;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'system' || stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // Ignore storage read errors in restricted contexts
  }
  return 'system';
}

export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(getInitialPreference);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(getSystemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    const root = document.documentElement;
    const isDark = resolvedTheme === 'dark';
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', resolvedTheme);

    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Ignore storage write errors
    }
  }, [preference, resolvedTheme]);

  return {
    preference,
    setPreference,
    resolvedTheme,
    systemTheme: systemPrefersDark ? ('dark' as const) : ('light' as const),
  };
}
