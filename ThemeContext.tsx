import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { palettes } from '../theme';
import { Palette, ThemeMode } from '../types';
import { loadJSON, saveJSON, StorageKeys } from '../utils/storage';

/**
 * Tema global via Context API (estado global leve, sem Redux).
 * Ordem de decisão do modo inicial:
 *  1. escolha salva pelo usuário; 2. preferência do sistema; 3. dark.
 */

interface ThemeContextValue {
  mode: ThemeMode;
  colors: Palette;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(system === 'light' ? 'light' : 'dark');

  useEffect(() => {
    loadJSON<ThemeMode | null>(StorageKeys.tema, null).then((saved) => {
      if (saved === 'dark' || saved === 'light') setMode(saved);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      void saveJSON(StorageKeys.tema, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, colors: palettes[mode], toggleTheme }),
    [mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  return ctx;
}
