import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../constants/colors';
import { space } from '../constants/spacing';
import { type as typeScale } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { cardElevation } from '../utils/cardStyles';
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
  /** Increment today’s count by 1 (quick action) */
  onQuickAdd?: () => void | Promise<void>;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitCard({
  habit,
  category,
  streak,
  todayCount,
  onLog,
  onQuickAdd,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const { colors, isDark } = useTheme();
  const [adding, setAdding] = useState(false);

  const runQuickAdd = async () => {
    if (!onQuickAdd || adding) return;
    setAdding(true);
    try {
      await onQuickAdd();
    } finally {
      setAdding(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, cardElevation(isDark)]}>
      <Text style={[typeScale.section, { color: colors.text }]}>{habit.name}</Text>
      {category ? (
        <CategoryBadge name={category.name} colour={category.colour} icon={category.icon} />
      ) : null}
      {streak > 0 ? <StreakBadge streak={streak} /> : null}
      <Text style={[styles.meta, { color: colors.secondaryText }, typeScale.caption]}>
        Today: {todayCount}
      </Text>
      <View style={styles.actions}>
        {onQuickAdd ? (
          <Pressable
            onPress={() => void runQuickAdd()}
            disabled={adding}
            accessibilityLabel={`Add one for ${habit.name} today`}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.accentBtn, { color: colors.accent }, typeScale.bodyStrong]}>+1 today</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={onLog} accessibilityLabel={`Log ${habit.name}`} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={[styles.mutedBtn, { color: colors.accent }, typeScale.bodyStrong]}>Log</Text>
        </Pressable>
        <Pressable onPress={onEdit} accessibilityLabel={`Edit ${habit.name}`} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={[styles.mutedBtn, { color: colors.text }, typeScale.bodyStrong]}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} accessibilityLabel={`Delete ${habit.name}`} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={[styles.mutedBtn, { color: palette.danger }, typeScale.bodyStrong]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: space.md, borderRadius: 16, borderWidth: 1 },
  meta: { marginTop: space.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.md, alignItems: 'center' },
  accentBtn: {},
  mutedBtn: {},
  pressed: { opacity: 0.75 },
});
