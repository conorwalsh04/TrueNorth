import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import CategoryBadge from './CategoryBadge';
import StreakBadge from './StreakBadge';

export type HabitCardHabit = { id: number; name: string };
export type HabitCardCategory = { name: string; colour: string; icon: string };

export type HabitCardProps = {
  habit: HabitCardHabit;
  category: HabitCardCategory | undefined;
  streak: number;
  todayCount: number;
  onLog: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitCard({
  habit,
  category,
  streak,
  todayCount,
  onLog,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.name, { color: colors.text }]}>{habit.name}</Text>
      {category ? (
        <CategoryBadge name={category.name} colour={category.colour} icon={category.icon} />
      ) : null}
      {streak > 0 ? <StreakBadge streak={streak} /> : null}
      <Text style={[styles.meta, { color: colors.secondaryText }]}>Today: {todayCount}</Text>
      <View style={styles.actions}>
        <Pressable onPress={onLog} accessibilityLabel={`Log ${habit.name}`}>
          <Text style={{ color: colors.accent, fontWeight: '600' }}>Log</Text>
        </Pressable>
        <Pressable onPress={onEdit} accessibilityLabel={`Edit ${habit.name}`}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} accessibilityLabel={`Delete ${habit.name}`}>
          <Text style={{ color: palette.danger, fontWeight: '600' }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, borderWidth: 1 },
  name: { fontSize: 18, fontWeight: '700' },
  meta: { marginTop: 8 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 12 },
});
