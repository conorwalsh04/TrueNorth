import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type EmptyStateProps = {
  message: string;
  icon?: string;
};

export default function EmptyState({ message, icon = '🧭' }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap} accessibilityLabel={message}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: { fontSize: 56, marginBottom: 16 },
  message: { fontSize: 18, textAlign: 'center', fontWeight: '600' },
});
