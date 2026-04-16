import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import { palette } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';
import { useHabits } from '../hooks/useHabits';

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { categories, loading, refresh, deleteCategory } = useCategories(user?.id ?? 0);
  const { habits, refresh: refreshHabits } = useHabits(user?.id ?? 0);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshHabits();
    }, [refresh, refreshHabits]),
  );

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]} accessibilityLabel="Categories list">
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          !loading ? <EmptyState message="No categories yet. Tap + to create one." icon="📁" /> : null
        }
        renderItem={({ item }) => {
          const hasHabits = habits.some((habit) => habit.categoryId == item.id);
          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={styles.titleRow}>
                  <Text style={styles.icon}>{item.icon}</Text>
                  <View>
                    <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                    <View style={[styles.swatch, { backgroundColor: item.colour }]} />
                  </View>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/category-form',
                        params: { id: String(item.id) },
                      })
                    }
                    accessibilityLabel={`Edit category ${item.name}`}
                  >
                    <Text style={[styles.actionText, { color: colors.text }]}>Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      if (hasHabits) {
                        Alert.alert(
                          'Category in use',
                          'Move or delete habits in this category before deleting it.',
                        );
                        return;
                      }
                      Alert.alert('Delete category', `Delete ${item.name}?`, [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => void deleteCategory(item.id),
                        },
                      ]);
                    }}
                    accessibilityLabel={`Delete category ${item.name}`}
                  >
                    <Text style={[styles.actionText, { color: palette.danger }]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/category-form')}
        accessibilityLabel="Add category"
        accessibilityRole="button"
      >
        <Text style={[styles.fabText, { color: palette.navy }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 16, paddingBottom: 100 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { fontSize: 28 },
  name: { fontSize: 18, fontWeight: '700' },
  swatch: { width: 26, height: 10, borderRadius: 999, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 16 },
  actionText: { fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { fontSize: 28, fontWeight: '700' },
});
