import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../../components/EmptyState';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTargets } from '../../hooks/useTargets';

export default function TargetsTab() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { targets, loading } = useTargets(user?.id ?? 0);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]} accessibilityLabel="Targets screen">
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={[styles.muted, { color: colors.secondaryText }]} accessibilityLabel="Loading targets">
            Loading…
          </Text>
        ) : null}
        {!loading && targets.length === 0 ? (
          <EmptyState message="Set a target to track your progress." icon="🎯" />
        ) : null}
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
  content: { flexGrow: 1, padding: 16, paddingBottom: 100 },
  muted: { textAlign: 'center', marginTop: 24 },
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
