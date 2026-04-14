import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import { palette } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]} accessibilityLabel="Categories list">
      <EmptyState message="No categories yet. Tap + to create one." icon="📁" />
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
