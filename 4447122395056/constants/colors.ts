/** Static TrueNorth palette (screens should use ThemeContext at runtime). */
export const colors = {
  navy: '#0D1B2A',
  gold: '#F2A71B',
  white: '#FFFFFF',
  cardDark: '#1C2B3A',
  lightBg: '#F5F7FA',
  lightBorder: '#E0E0E0',
  darkBorder: '#2C3E50',
  danger: '#E74C3C',
} as const;

/** Alias for concise imports where `colors` reads naturally. */
export const palette = colors;
