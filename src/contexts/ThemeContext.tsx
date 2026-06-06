// ============================================
// THEME CONTEXT - Tema (claro/escuro/sistema) e tamanho de fonte
// Persiste a preferência em localStorage e aplica via classe `.dark`
// e atributo `data-font-size` no <html>.
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'sm' | 'md' | 'lg';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  /** Tema efetivamente aplicado (resolve 'system'). */
  resolvedTheme: 'light' | 'dark';
}

const THEME_KEY = 'sabiencia-theme';
const FONT_KEY = 'sabiencia-font-size';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): 'light' | 'dark' =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const readStored = <T extends string>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  return (localStorage.getItem(key) as T) || fallback;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => readStored<ThemeMode>(THEME_KEY, 'system'));
  const [fontSize, setFontSizeState] = useState<FontSize>(() => readStored<FontSize>(FONT_KEY, 'md'));
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    readStored<ThemeMode>(THEME_KEY, 'system') === 'dark' ? 'dark' : 'light'
  );

  // Aplica o tema (resolvendo 'system') ao documento.
  useEffect(() => {
    const apply = () => {
      const resolved = theme === 'system' ? getSystemTheme() : theme;
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };

    apply();

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  // Aplica o tamanho de fonte.
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  const setTheme = useCallback((mode: ThemeMode) => {
    localStorage.setItem(THEME_KEY, mode);
    setThemeState(mode);
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    localStorage.setItem(FONT_KEY, size);
    setFontSizeState(size);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return ctx;
};
