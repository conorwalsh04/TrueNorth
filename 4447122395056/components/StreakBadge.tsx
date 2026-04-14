import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type StreakBadgeProps = {
  streak: number;
};

export default function StreakBadge({ streak }: StreakBadgeProps) {
  const { colors } = useTheme();

  if (streak <= 0) return null;

  return (
    <View style={styles.wrap} accessibilityLabel={`Streak ${streak} days`}>
      <Text style={[styles.text, { color: colors.text }]}>🔥 {streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 6, alignSelf: 'flex-start' },
  text: { fontWeight: '700' },
});
