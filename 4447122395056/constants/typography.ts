/** Shared text scale for consistent hierarchy across screens */
export const type = {
  screenTitle: { fontSize: 22, fontWeight: '700' as const },
  section: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
} as const;
