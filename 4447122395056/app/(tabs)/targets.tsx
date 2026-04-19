import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useCategories';
import { useHabits } from '../../hooks/useHabits';
import { useLogs } from '../../hooks/useLogs';
import { useTargets } from '../../hooks/useTargets';

function startOfWeek(): string {
  const d = new Date();
  const day = d.getDay(); // 0 Sunday
  const diff = d.getDate() - day + 1; // Monday start
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  return monday.toISOString().slice(0, 10);
}

function startOfMonth(): string {
  const d = new Date();
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  return first.toISOString().slice(0, 10);
}

export default function TargetsTab() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { targets, loading, refresh } = useTargets(user?.id ?? 0);
  const { habits, refresh: refreshHabits } = useHabits(user?.id ?? 0);
  const { categories } = useCategories(user?.id ?? 0);
  const { logs, refresh: refreshLogs } = useLogs();

  useFocusEffect(
    useCallback(() => {
      void Promise.all([refresh(), refreshHabits(), refreshLogs()]);
    }, [refresh, refreshHabits, refreshLogs]),
  );

  const today = new Date().toISOString().slice(0, 10);
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  const habitById = new Map(habits.map((h) => [h.id, h] as const));

  const progressFor = (target: { habitId: number | null; type: 'weekly' | 'monthly'; categoryId: number | null; goal: number }) => {
    const start = target.type === 'weekly' ? weekStart : monthStart;
    let relevantLogs = logs.filter((log) => log.date >= start && log.date <= today);

    if (target.habitId != null) {
      relevantLogs = relevantLogs.filter((log) => log.habitId === target.habitId);
    } else if (target.categoryId != null) {
      const habitIds = habits.filter((h) => h.categoryId === target.categoryId).map((h) => h.id);
      relevantLogs = relevantLogs.filter((log) => habitIds.includes(log.habitId));
    } else {
      // global: all habits of user
      const habitIds = habits.map((h) => h.id);
      relevantLogs = relevantLogs.filter((log) => habitIds.includes(log.habitId));
    }

    const count = relevantLogs.reduce((sum, log) => sum + log.count, 0);
    const ratio = target.goal > 0 ? count / target.goal : 0;
    return { count, ratio };
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]} accessibilityLabel="Targets screen">
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={[styles.muted, { color: colors.secondaryText }]} accessibilityLabel="Loading targets">
            Loading…
          </Text>
        ) : null}

        {!loading && targets.length === 0 ? (
          <EmptyState
            title="No targets yet"
            message="Set a target to track your progress."
            subtitle="Create weekly or monthly goals for all habits, one habit, or a category."
            icon="🎯"
            actionLabel="Add target"
            onAction={() => router.push('/target-form')}
          />
        ) : null}

        {!loading &&
          targets.map((target) => {
            const { count, ratio } = progressFor(target);
            const pct = Math.round(Math.min(1, ratio) * 100);
            const typeLabel = target.type === 'weekly' ? 'Weekly' : 'Monthly';
            const cat =
              target.categoryId != null
                ? categories.find((c) => c.id === target.categoryId)
                : undefined;
            const habitLabel =
              target.habitId != null
                ? habitById.get(target.habitId)?.name ?? 'Habit'
                : cat
                  ? `${cat.icon} ${cat.name}`
                  : 'All habits';

            const remaining = Math.max(0, target.goal - count);
            const statusLabel =
              ratio >= 1 ? (ratio > 1 ? 'Above goal' : 'Goal met') : `Below goal — ${remaining} to go`;

            return (
              <View
                key={target.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.typeBadge, { color: colors.text }]}>{typeLabel}</Text>
                    <Text style={[styles.habitLabel, { color: colors.secondaryText }]}>{habitLabel}</Text>
                  </View>
                  {ratio > 1 ? <Text style={styles.trophy}>🏆 Exceeded!</Text> : null}
                </View>
                <Text style={[styles.goal, { color: colors.text }]}>Goal: {target.goal}</Text>
                <Text style={[styles.progressText, { color: colors.secondaryText }]}>
                  Current: {count} ({pct}%) · Remaining: {remaining}
                </Text>
                <Text
                  style={[
                    styles.statusLine,
                    { color: ratio >= 1 ? colors.accent : colors.secondaryText },
                  ]}
                  accessibilityLabel={`Target status ${statusLabel}`}
                >
                  {statusLabel}
                </Text>
                <View style={styles.progressBarWrap}>
                  <ProgressBar progress={ratio} />
                </View>
              </View>
            );
          })}
      </ScrollView>
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/target-form')}
        accessibilityLabel="Add target"
        accessibilityRole="button"
      >
        <Text style={[styles.fabText, { color: palette.navy }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 16, paddingBottom: 100, gap: 12 },
  muted: { textAlign: 'center', marginTop: 24 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: { fontWeight: '700' },
  habitLabel: { fontSize: 13 },
  trophy: { fontSize: 16 },
  goal: { marginTop: 8, fontWeight: '600' },
  progressText: { marginTop: 4 },
  statusLine: { marginTop: 4, fontSize: 13, fontWeight: '600' },
  progressBarWrap: { marginTop: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { fontSize: 28, fontWeight: '700' },
});
