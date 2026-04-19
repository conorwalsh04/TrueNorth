import { Pressable, StyleSheet, Text, View } from 'react-native';
import { space } from '../constants/spacing';
import { type as typeScale } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { cardElevation } from '../utils/cardStyles';

export type EmptyStateProps = {
  /** Short line above the main message (e.g. "Nothing here yet") */
  title?: string;
  message: string;
  subtitle?: string;
  icon?: string;
  /** Primary action (e.g. navigate to add habit) */
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  message,
  subtitle,
  icon = '🧭',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        cardElevation(isDark),
      ]}
      accessibilityLabel={title ? `${title}. ${message}` : message}
    >
      <Text style={styles.icon}>{icon}</Text>
      {title ? (
        <Text style={[typeScale.section, { color: colors.text, marginBottom: space.xs }]}>{title}</Text>
      ) : null}
      <Text style={[typeScale.body, { color: colors.text, textAlign: 'center', fontWeight: '600' }]}>
        {message}
      </Text>
      {subtitle ? (
        <Text style={[typeScale.caption, { color: colors.secondaryText, textAlign: 'center', marginTop: space.sm }]}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          style={[styles.action, { backgroundColor: colors.accent }]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[typeScale.bodyStrong, { color: '#0D1B2A' }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.xl,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: space.md,
  },
  icon: { fontSize: 56, marginBottom: space.md },
  action: {
    marginTop: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderRadius: 12,
  },
});
