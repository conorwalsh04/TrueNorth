import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import EmptyState from '../../components/EmptyState';
import HabitCard from '../../components/HabitCard';
import QuoteCard from '../../components/QuoteCard';
import { palette } from '../../constants/colors';
import { space } from '../../constants/spacing';
import { type as typeScale } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useCategories';
import { useHabits } from '../../hooks/useHabits';
import { useLogs } from '../../hooks/useLogs';
import { fetchMotivationalQuote } from '../../utils/api';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import { calculateStreak } from '../../utils/streaks';

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function logHasActivityInRange(
  habitLogs: { date: string; count: number; completed: number }[],
  from: string,
  to: string,
): boolean {
  return habitLogs.some((l) => {
    if (from && l.date < from) return false;
    if (to && l.date > to) return false;
    return l.completed === 1 || l.count > 0;
  });
}

export default function HabitsTab() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { habits, loading, refresh, deleteHabit } = useHabits(user?.id ?? 0);
  const { categories, refresh: refreshCategories } = useCategories(user?.id ?? 0);
  const { logs, refresh: refreshLogs, addLog, updateLog } = useLogs();
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [logDateFrom, setLogDateFrom] = useState('');
  const [logDateTo, setLogDateTo] = useState('');
  const [quote, setQuote] = useState({ quote: '', author: '', fetchError: false });
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLastUpdated(new Date());
      void Promise.all([refresh(), refreshCategories(), refreshLogs()]);
    }, [refresh, refreshCategories, refreshLogs]),
  );

  useEffect(() => {
    let active = true;
    setQuoteLoading(true);
    void fetchMotivationalQuote().then((q) => {
      if (!active) return;
      setQuote({ quote: q.quote, author: q.author, fetchError: Boolean(q.fetchError) });
      setQuoteLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setQuoteLoading(true);
    try {
      await Promise.all([refresh(), refreshCategories(), refreshLogs()]);
      const q = await fetchMotivationalQuote();
      setQuote({ quote: q.quote, author: q.author, fetchError: Boolean(q.fetchError) });
    } finally {
      setQuoteLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  }, [refresh, refreshCategories, refreshLogs]);

  const today = new Date().toISOString().slice(0, 10);

  const quickAddToday = useCallback(
    async (habitId: number) => {
      await hapticLight();
      const existing = logs.find((l) => l.habitId === habitId && l.date === today);
      try {
        if (existing) {
          await updateLog(existing.id, {
            count: existing.count + 1,
            completed: 1,
          });
        } else {
          await addLog({
            habitId,
            date: today,
            count: 1,
            notes: null,
            completed: 1,
          });
        }
        await hapticSuccess();
        await refreshLogs();
      } catch {
        /* sqlite error */
      }
    },
    [logs, today, addLog, updateLog, refreshLogs],
  );

  const dateFilterError = useMemo(() => {
    const from = logDateFrom.trim();
    const to = logDateTo.trim();
    if (!from && !to) return '';
    if (from && !ISO_DATE.test(from)) return 'Start date must be YYYY-MM-DD.';
    if (to && !ISO_DATE.test(to)) return 'End date must be YYYY-MM-DD.';
    if (from && to && from > to) return 'Start date must be on or before end date.';
    return '';
  }, [logDateFrom, logDateTo]);

  const filtered = useMemo(() => {
    let list = habits;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((h) => h.name.toLowerCase().includes(q));
    }
    if (selectedCategoryId !== 'all') {
      list = list.filter((h) => h.categoryId === selectedCategoryId);
    }

    const from = logDateFrom.trim();
    const to = logDateTo.trim();
    if (!dateFilterError && (from || to)) {
      list = list.filter((h) => {
        const habitLogs = logs
          .filter((l) => l.habitId === h.id)
          .map((l) => ({ date: l.date, count: l.count, completed: l.completed }));
        return logHasActivityInRange(habitLogs, from, to);
      });
    }

    return list;
  }, [habits, search, selectedCategoryId, logDateFrom, logDateTo, logs, dateFilterError]);

  const greeting = `${greetingForNow()}, ${user?.username ?? 'friend'}`;
  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]} accessibilityLabel="Habits screen">
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={[styles.greeting, { color: colors.text }]} accessibilityRole="header">
              {greeting}
            </Text>
            {lastUpdatedLabel ? (
              <Text
                style={[styles.lastUpdated, typeScale.caption, { color: colors.secondaryText }]}
                accessibilityLabel={`List updated at ${lastUpdatedLabel}`}
              >
                Updated {lastUpdatedLabel}
              </Text>
            ) : null}
            <QuoteCard
              quote={quote.quote}
              author={quote.author}
              loading={quoteLoading}
              fetchError={quote.fetchError}
            />
            <TextInput
              style={[
                styles.search,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              placeholder="Search habits"
              placeholderTextColor={colors.secondaryText}
              value={search}
              onChangeText={setSearch}
              accessibilityLabel="Search habits"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillScroll}>
              <Pressable
                onPress={() => setSelectedCategoryId('all')}
                style={[
                  styles.pill,
                  {
                    backgroundColor: selectedCategoryId === 'all' ? colors.accent : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                accessibilityLabel="Filter all categories"
                accessibilityRole="button"
              >
                <Text style={{ color: selectedCategoryId === 'all' ? palette.navy : colors.text, fontWeight: '600' }}>
                  All
                </Text>
              </Pressable>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setSelectedCategoryId(c.id)}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: selectedCategoryId === c.id ? colors.accent : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  accessibilityLabel={`Filter category ${c.name}`}
                  accessibilityRole="button"
                >
                  <Text style={{ color: selectedCategoryId === c.id ? palette.navy : colors.text, fontWeight: '600' }}>
                    {c.icon} {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={[styles.filterHeading, { color: colors.secondaryText }]}>
              Activity date range (optional)
            </Text>
            <Text style={[styles.filterHint, { color: colors.secondaryText }]}>
              Show habits that have at least one logged day in this range (count or completed).
            </Text>
            <View style={styles.dateRow}>
              <TextInput
                style={[
                  styles.dateInput,
                  {
                    color: colors.text,
                    borderColor: dateFilterError ? palette.danger : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="From YYYY-MM-DD"
                placeholderTextColor={colors.secondaryText}
                value={logDateFrom}
                onChangeText={setLogDateFrom}
                accessibilityLabel="Filter habits by log activity start date"
              />
              <TextInput
                style={[
                  styles.dateInput,
                  {
                    color: colors.text,
                    borderColor: dateFilterError ? palette.danger : colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
                placeholder="To YYYY-MM-DD"
                placeholderTextColor={colors.secondaryText}
                value={logDateTo}
                onChangeText={setLogDateTo}
                accessibilityLabel="Filter habits by log activity end date"
              />
            </View>
            {dateFilterError ? (
              <Text style={[styles.dateError, { color: palette.danger }]} accessibilityLiveRegion="polite">
                {dateFilterError}
              </Text>
            ) : null}
            {loading ? (
              <View style={styles.loadingRow} accessibilityLabel="Loading habits">
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title={habits.length === 0 ? 'Your habits live here' : undefined}
              message={
                habits.length === 0
                  ? 'Start your journey. Add your first habit.'
                  : 'No habits match your search, category, or activity date range.'
              }
              subtitle={
                habits.length === 0 ? 'Track streaks, logs, and targets in one place.' : undefined
              }
              icon="🧭"
              actionLabel={habits.length === 0 ? 'Add habit' : undefined}
              onAction={habits.length === 0 ? () => router.push('/habit-form') : undefined}
            />
          ) : null
        }
        renderItem={({ item }) => {
          const category = categories.find((c) => c.id === item.categoryId);
          const habitLogs = logs.filter((log) => log.habitId === item.id);
          const todayCount = habitLogs
            .filter((log) => log.date === today)
            .reduce((sum, log) => sum + log.count, 0);
          const streak = calculateStreak(
            habitLogs.map((log) => ({
              habitId: log.habitId,
              date: log.date,
              count: log.count,
              completed: log.completed,
            })),
            item.id,
          );

          return (
            <View style={styles.cardWrap}>
              <HabitCard
                habit={{ id: item.id, name: item.name }}
                category={category ? { name: category.name, colour: category.colour, icon: category.icon } : undefined}
                streak={streak}
                todayCount={todayCount}
                onQuickAdd={() => void quickAddToday(item.id)}
                onLog={() => router.push({ pathname: '/habit-log', params: { habitId: String(item.id) } })}
                onEdit={() => router.push({ pathname: '/habit-form', params: { id: String(item.id) } })}
                onDelete={() => {
                  Alert.alert('Delete habit', `Remove "${item.name}"? This cannot be undone.`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => void deleteHabit(item.id),
                    },
                  ]);
                }}
              />
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/habit-form')}
        accessibilityLabel="Add habit"
        accessibilityRole="button"
      >
        <Text style={[styles.fabText, { color: palette.navy }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  listContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 100 },
  headerBlock: { paddingTop: 8 },
  greeting: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  lastUpdated: { marginBottom: space.sm },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  pillScroll: { marginBottom: 12 },
  filterHeading: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  filterHint: { fontSize: 12, lineHeight: 18, marginBottom: 8 },
  dateRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  dateError: { fontSize: 13, marginBottom: 8, fontWeight: '600' },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  loadingRow: { paddingVertical: 12, alignItems: 'center' },
  cardWrap: { marginBottom: 12 },
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
