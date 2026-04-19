import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { palette } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';
import { useHabits } from '../hooks/useHabits';
import { useTargets } from '../hooks/useTargets';
import { hapticSuccess } from '../utils/haptics';

type TargetScope = 'global' | 'habit' | 'category';

export default function TargetFormScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { habits } = useHabits(user?.id ?? 0);
  const { categories } = useCategories(user?.id ?? 0);
  const { addTarget } = useTargets(user?.id ?? 0);

  const [scope, setScope] = useState<TargetScope>('global');
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');

  const onSave = async () => {
    setError('');
    if (!user) return;
    const parsedGoal = Number(goal);
    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      setError('Please enter a positive goal.');
      return;
    }

    let habitId: number | null = null;
    let categoryId: number | null = null;
    if (scope === 'habit') {
      habitId = selectedHabitId;
      if (habitId == null) {
        setError('Select a habit for this target.');
        return;
      }
    } else if (scope === 'category') {
      categoryId = selectedCategoryId;
      if (categoryId == null) {
        setError('Select a category for this target.');
        return;
      }
    }

    await addTarget({
      habitId,
      userId: user.id,
      type,
      goal: parsedGoal,
      categoryId,
    });
    await hapticSuccess();
    router.back();
  };

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Target form"
    >
      <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
        New target
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Applies to</Text>
      <View style={styles.habitRow}>
        <Pressable
          style={[
            styles.habitChip,
            {
              backgroundColor: scope === 'global' ? colors.accent : colors.card,
              borderColor: scope === 'global' ? colors.accent : colors.border,
            },
          ]}
          onPress={() => {
            setScope('global');
            setSelectedHabitId(null);
            setSelectedCategoryId(null);
          }}
          accessibilityLabel="Global target for all habits"
          accessibilityRole="button"
        >
          <Text style={{ color: scope === 'global' ? palette.navy : colors.text, fontWeight: '600' }}>
            All habits
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.habitChip,
            {
              backgroundColor: scope === 'habit' ? colors.accent : colors.card,
              borderColor: scope === 'habit' ? colors.accent : colors.border,
            },
          ]}
          onPress={() => {
            setScope('habit');
            setSelectedCategoryId(null);
          }}
          accessibilityLabel="Target scope single habit"
          accessibilityRole="button"
        >
          <Text style={{ color: scope === 'habit' ? palette.navy : colors.text, fontWeight: '600' }}>
            One habit
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.habitChip,
            {
              backgroundColor: scope === 'category' ? colors.accent : colors.card,
              borderColor: scope === 'category' ? colors.accent : colors.border,
            },
          ]}
          onPress={() => {
            setScope('category');
            setSelectedHabitId(null);
          }}
          accessibilityLabel="Target scope one category"
          accessibilityRole="button"
        >
          <Text style={{ color: scope === 'category' ? palette.navy : colors.text, fontWeight: '600' }}>
            One category
          </Text>
        </Pressable>
      </View>

      {scope === 'habit' ? (
        <>
          <Text style={[styles.subLabel, { color: colors.secondaryText }]}>Pick a habit</Text>
          <View style={styles.habitRow}>
            {habits.map((habit) => {
              const selected = selectedHabitId === habit.id;
              return (
                <Pressable
                  key={habit.id}
                  style={[
                    styles.habitChip,
                    {
                      backgroundColor: selected ? colors.accent : colors.card,
                      borderColor: selected ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedHabitId(habit.id)}
                  accessibilityLabel={`Target for habit ${habit.name}`}
                  accessibilityRole="button"
                >
                  <Text style={{ color: selected ? palette.navy : colors.text, fontWeight: '600' }}>
                    {habit.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {scope === 'category' ? (
        <>
          <Text style={[styles.subLabel, { color: colors.secondaryText }]}>Pick a category</Text>
          <View style={styles.habitRow}>
            {categories.map((cat) => {
              const selected = selectedCategoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.habitChip,
                    {
                      backgroundColor: selected ? colors.accent : colors.card,
                      borderColor: selected ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  accessibilityLabel={`Target for category ${cat.name}`}
                  accessibilityRole="button"
                >
                  <Text style={{ color: selected ? palette.navy : colors.text, fontWeight: '600' }}>
                    {cat.icon} {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      <Text style={[styles.label, { color: colors.text }]}>Type</Text>
      <View style={styles.typeRow}>
        <Pressable
          style={[
            styles.typeChip,
            {
              backgroundColor: type === 'weekly' ? colors.accent : colors.card,
              borderColor: type === 'weekly' ? colors.accent : colors.border,
            },
          ]}
          onPress={() => setType('weekly')}
          accessibilityLabel="Weekly target type"
          accessibilityRole="button"
        >
          <Text style={{ color: type === 'weekly' ? palette.navy : colors.text, fontWeight: '600' }}>
            Weekly
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.typeChip,
            {
              backgroundColor: type === 'monthly' ? colors.accent : colors.card,
              borderColor: type === 'monthly' ? colors.accent : colors.border,
            },
          ]}
          onPress={() => setType('monthly')}
          accessibilityLabel="Monthly target type"
          accessibilityRole="button"
        >
          <Text style={{ color: type === 'monthly' ? palette.navy : colors.text, fontWeight: '600' }}>
            Monthly
          </Text>
        </Pressable>
      </View>

      <FormField
        label="Goal count"
        placeholder="e.g. 7"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}

      <View style={styles.row}>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Cancel target form"
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={() => void onSave()}
          accessibilityLabel="Save target"
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, { color: palette.navy }]}>Save</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  label: { fontWeight: '700', marginBottom: 8, marginTop: 8 },
  subLabel: { fontSize: 13, marginBottom: 8 },
  habitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  habitChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  typeChip: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 16 },
  error: { marginTop: -4, marginBottom: 8 },
});
