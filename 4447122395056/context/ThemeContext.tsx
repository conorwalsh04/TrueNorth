import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  accent: string;
  border: string;
  secondaryText: string;
};

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
  /** Prefer simpler visuals / less chart decoration when enabled */
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
  colors: ThemeColors;
};

const lightColors: ThemeColors = {
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#0D1B2A',
  accent: '#F2A71B',
  border: '#E0E0E0',
  secondaryText: '#666666',
};

const darkColors: ThemeColors = {
  background: '#0D1B2A',
  card: '#1C2B3A',
  text: '#FFFFFF',
  accent: '#F2A71B',
  border: '#2C3E50',
  secondaryText: '#AAAAAA',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [themeV, reduceV] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.themeIsDark),
          AsyncStorage.getItem(STORAGE_KEYS.reduceMotion),
        ]);
        if (cancelled) return;
        if (themeV === 'true') {
          setIsDark(true);
        } else if (themeV === 'false') {
          setIsDark(false);
        }
        if (reduceV === 'true') {
          setReduceMotion(true);
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((d) => {
      const next = !d;
      void AsyncStorage.setItem(STORAGE_KEYS.themeIsDark, next ? 'true' : 'false');
      return next;
    });
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((r) => {
      const next = !r;
      void AsyncStorage.setItem(STORAGE_KEYS.reduceMotion, next ? 'true' : 'false');
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme,
      reduceMotion,
      toggleReduceMotion,
      colors: isDark ? darkColors : lightColors,
    }),
    [isDark, toggleTheme, reduceMotion, toggleReduceMotion],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
