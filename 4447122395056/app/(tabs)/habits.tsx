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
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useCategories';
import { useHabits } from '../../hooks/useHabits';
import { fetchMotivationalQuote } from '../../utils/api';

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HabitsTab() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { habits, loading, refresh, deleteHabit } = useHabits(user?.id ?? 0);
  const { categories, refresh: refreshCategories } = useCategories(user?.id ?? 0);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    setQuoteLoading(true);
    void fetchMotivationalQuote().then((q) => {
      if (!active) return;
      setQuote(q);
      setQuoteLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refresh(), refreshCategories()]);
    setRefreshing(false);
  }, [refresh, refreshCategories]);

  const filtered = useMemo(() => {
    let list = habits;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((h) => h.name.toLowerCase().includes(q));
    }
    if (selectedCategoryId !== 'all') {
      list = list.filter((h) => h.categoryId === selectedCategoryId);
    }
    return list;
  }, [habits, search, selectedCategoryId]);

  const greeting = `${greetingForNow()}, ${user?.username ?? 'friend'}`;

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
            <QuoteCard quote={quote.quote} author={quote.author} loading={quoteLoading} />
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
                <Text
                  style={{
                    color: selectedCategoryId === 'all' ? palette.navy : colors.text,
                    fontWeight: '600',
                  }}
                >
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
                  <Text
                    style={{
                      color: selectedCategoryId === c.id ? palette.navy : colors.text,
                      fontWeight: '600',
                    }}
                  >
                    {c.icon} {c.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            {loading ? (
              <View style={styles.loadingRow} accessibilityLabel="Loading habits">
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState message="Start your journey. Add your first habit." icon="🧭" />
          ) : null
        }
        renderItem={({ item }) => {
          const category = categories.find((c) => c.id === item.categoryId);
          return (
            <View style={styles.cardWrap}>
              <HabitCard
                habit={{ id: item.id, name: item.name }}
                category={
                  category
                    ? { name: category.name, colour: category.colour, icon: category.icon }
                    : undefined
                }
                streak={0}
                todayCount={0}
                onLog={() =>
                  router.push({ pathname: '/habit-log', params: { habitId: String(item.id) } })
                }
                onEdit={() => router.push('/habit-form')}
                onDelete={() => {
                  Alert.alert(
                    'Delete habit',
                    `Remove "${item.name}"? This cannot be undone.`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => void deleteHabit(item.id),
                      },
                    ],
                  );
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
  greeting: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  pillScroll: { marginBottom: 12 },
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
