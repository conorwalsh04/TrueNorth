import { Platform, type ViewStyle } from 'react-native';

/** Subtle elevation so cards lift off background (light + dark). */
export function cardElevation(isDark: boolean): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: isDark ? 4 : 3,
    },
    default: {},
  }) ?? {};
}
