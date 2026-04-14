import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { palette } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

type Period = 'week' | 'month' | 'all';

export default function InsightsTab() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<Period>('week');

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      accessibilityLabel="Insights screen"
    >
      <View style={styles.toggleRow}>
        {(
          [
            { key: 'week' as const, label: 'This Week' },
            { key: 'month' as const, label: 'This Month' },
            { key: 'all' as const, label: 'All Time' },
          ] as const
        ).map(({ key, label }) => (
          <Pressable
            key={key}
            onPress={() => setPeriod(key)}
            style={[
              styles.toggle,
              {
                backgroundColor: period === key ? colors.accent : colors.card,
                borderColor: colors.border,
              },
            ]}
            accessibilityLabel={`Insights period ${label}`}
            accessibilityRole="button"
          >
            <Text
              style={{
                color: period === key ? palette.navy : colors.text,
                fontWeight: '600',
                fontSize: 13,
              }}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly activity</Text>
        <Text style={[styles.muted, { color: colors.secondaryText }]}>No chart data yet.</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Category mix</Text>
        <Text style={[styles.muted, { color: colors.secondaryText }]}>No chart data yet.</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Streak leaderboard</Text>
        <Text style={[styles.muted, { color: colors.secondaryText }]}>No streak data yet.</Text>
      </View>
      <Pressable
        style={[styles.exportBtn, { backgroundColor: colors.accent }]}
        accessibilityLabel="Export habit logs as CSV"
        accessibilityRole="button"
      >
        <Text style={[styles.exportText, { color: palette.navy }]}>Export CSV</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggle: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  muted: { lineHeight: 20 },
  exportBtn: { marginTop: 8, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  exportText: { fontWeight: '700', fontSize: 16 },
});
