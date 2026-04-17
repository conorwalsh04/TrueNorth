import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useCategories';
import { useHabits } from '../../hooks/useHabits';
import { useLogs } from '../../hooks/useLogs';
import { exportLogsToCSV } from '../../utils/csvExport';
import {
  buildActivityBarData,
  buildCategoryPieData,
  getPeriodBounds,
  type InsightsPeriod,
} from '../../utils/insightsData';
import { calculateStreak } from '../../utils/streaks';

const screenWidth = Dimensions.get('window').width;

export default function InsightsTab() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [period, setPeriod] = useState<InsightsPeriod>('week');
  const [exporting, setExporting] = useState(false);

  const uid = user?.id ?? 0;
  const { habits, refresh: refreshHabits, loading: habitsLoading } = useHabits(uid);
  const { categories, refresh: refreshCategories, loading: categoriesLoading } =
    useCategories(uid);
  const { logs, refresh: refreshLogs, loading: logsLoading } = useLogs();

  useFocusEffect(
    useCallback(() => {
      void refreshHabits();
      void refreshCategories();
      void refreshLogs();
    }, [refreshHabits, refreshCategories, refreshLogs]),
  );

  const habitIds = useMemo(() => new Set(habits.map((h) => h.id)), [habits]);

  const { startKey, endKey } = useMemo(() => getPeriodBounds(period), [period]);

  const barSeries = useMemo(
    () => buildActivityBarData(period, logs, habitIds),
    [period, logs, habitIds],
  );

  const hasBarActivity = barSeries.data.some((n) => n > 0);

  const pieData = useMemo(
    () =>
      buildCategoryPieData(logs, habits, categories, habitIds, startKey, endKey, colors.text),
    [logs, habits, categories, habitIds, startKey, endKey, colors.text],
  );

  const streakRows = useMemo(() => {
    const userLogs = logs.filter((l) => habitIds.has(l.habitId));
    return habits
      .map((h) => ({
        habit: h,
        streak: calculateStreak(userLogs, h.id),
      }))
      .sort((a, b) => b.streak - a.streak);
  }, [habits, logs, habitIds]);

  const csvLogs = useMemo(() => {
    return logs
      .filter((l) => habitIds.has(l.habitId))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [logs, habitIds]);

  const loading = habitsLoading || categoriesLoading || logsLoading;

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: colors.card,
      backgroundGradientTo: colors.card,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(242, 167, 27, ${opacity})`,
      labelColor: () => colors.text,
      propsForLabels: {
        fontSize: 11,
      },
      propsForBackgroundLines: {
        stroke: colors.border,
      },
    }),
    [colors],
  );

  const onExport = useCallback(async () => {
    if (csvLogs.length === 0) {
      Alert.alert('Nothing to export', 'Log some habits first, then try again.');
      return;
    }
    setExporting(true);
    try {
      await exportLogsToCSV(
        csvLogs.map((l) => ({
          date: l.date,
          count: l.count,
          notes: l.notes,
          habitId: l.habitId,
          completed: l.completed,
        })),
        habits.map((h) => ({ id: h.id, name: h.name, categoryId: h.categoryId })),
        categories.map((c) => ({ id: c.id, name: c.name })),
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      Alert.alert('Export failed', message);
    } finally {
      setExporting(false);
    }
  }, [csvLogs, habits, categories]);

  const chartWidth = Math.max(280, screenWidth - 48);

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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : null}

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Activity</Text>
        <Text style={[styles.caption, { color: colors.secondaryText }]}>
          Total habit counts in the selected period
        </Text>
        {hasBarActivity ? (
          <BarChart
            data={{
              labels: barSeries.labels,
              datasets: [{ data: barSeries.data }],
            }}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        ) : (
          <Text style={[styles.muted, { color: colors.secondaryText }]}>
            No activity in this period yet.
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Category mix</Text>
        <Text style={[styles.caption, { color: colors.secondaryText }]}>
          Share of logged counts by category
        </Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData.map((s) => ({
              ...s,
              legendFontColor: colors.text,
            }))}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            style={styles.chart}
          />
        ) : (
          <Text style={[styles.muted, { color: colors.secondaryText }]}>
            No category data for this period yet.
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Streak leaderboard</Text>
        <Text style={[styles.caption, { color: colors.secondaryText }]}>
          Current streaks (🔥 = consecutive active days)
        </Text>
        {streakRows.length === 0 ? (
          <Text style={[styles.muted, { color: colors.secondaryText }]}>No habits yet.</Text>
        ) : (
          streakRows.map(({ habit, streak }, index) => (
            <View
              key={habit.id}
              style={[
                styles.leaderRow,
                { borderBottomColor: colors.border },
                index === streakRows.length - 1 && styles.leaderRowLast,
              ]}
            >
              <Text style={[styles.rank, { color: colors.secondaryText }]}>{index + 1}</Text>
              <Text style={[styles.habitName, { color: colors.text }]} numberOfLines={1}>
                {habit.name}
              </Text>
              <Text style={[styles.streakVal, { color: colors.accent }]}>
                {streak > 0 ? `🔥 ${streak}` : '—'}
              </Text>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={[
          styles.exportBtn,
          { backgroundColor: colors.accent, opacity: exporting ? 0.7 : 1 },
        ]}
        accessibilityLabel="Export habit logs as CSV"
        accessibilityRole="button"
        onPress={() => void onExport()}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator color={palette.navy} />
        ) : (
          <Text style={[styles.exportText, { color: palette.navy }]}>Export CSV</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  centered: { paddingVertical: 24, alignItems: 'center' },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggle: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  caption: { fontSize: 13, marginBottom: 12 },
  chart: { marginVertical: 8, borderRadius: 12 },
  muted: { lineHeight: 20 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  leaderRowLast: { borderBottomWidth: 0 },
  rank: { width: 28, fontWeight: '700', fontSize: 16 },
  habitName: { flex: 1, fontSize: 16 },
  streakVal: { fontWeight: '700', minWidth: 56, textAlign: 'right' },
  exportBtn: { marginTop: 8, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  exportText: { fontWeight: '700', fontSize: 16 },
});
