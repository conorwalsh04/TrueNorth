import React, { createContext, useContext, useMemo, useState } from 'react';

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

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((d) => !d),
      colors: isDark ? darkColors : lightColors,
    }),
    [isDark],
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
