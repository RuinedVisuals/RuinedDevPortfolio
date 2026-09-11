import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'ag-theme';

export function ThemeProvider({ children }) {
  const [reversed, setReversed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === 'reversed';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', reversed ? 'reversed' : 'default');
    try {
      window.localStorage.setItem(STORAGE_KEY, reversed ? 'reversed' : 'default');
    } catch {
      /* storage unavailable — ignore */
    }
  }, [reversed]);

  const toggle = useCallback(() => setReversed((v) => !v), []);

  return <ThemeContext.Provider value={{ reversed, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
