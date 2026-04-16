import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { palette } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';
import { useHabits } from '../hooks/useHabits';

export default function HabitFormScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { categories } = useCategories(user?.id ?? 0);
  const { habits, addHabit, updateHabit } = useHabits(user?.id ?? 0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const editing = useMemo(() => habits.find((habit) => habit.id === Number(id)), [habits, id]);

  useEffect(() => {
    if (!editing) return;
    setName(editing.name);
    setDescription(editing.description ?? '');
    setSelectedCategoryId(editing.categoryId);
  }, [editing]);

  useEffect(() => {
    if (selectedCategoryId === null && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const onSave = async () => {
    setError('');
    if (!user) return;
    if (!name.trim()) {
      setError('Habit name is required.');
      return;
    }
    if (selectedCategoryId === null) {
      setError('Please create a category first.');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      categoryId: selectedCategoryId,
      userId: user.id,
    };

    if (editing) {
      await updateHabit(editing.id, payload);
    } else {
      await addHabit(payload);
    }
    router.back();
  };

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Habit form"
    >
      <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
        {editing ? 'Edit habit' : 'Add habit'}
      </Text>
      <FormField label="Name" placeholder="Habit name" value={name} onChangeText={setName} />
      <FormField
        label="Description"
        placeholder="Optional details"
        value={description}
        onChangeText={setDescription}
      />
      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}
      <Text style={[styles.section, { color: colors.text }]}>Category</Text>
      <View style={styles.categoryList}>
        {categories.map((category) => {
          const selected = category.id === selectedCategoryId;
          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selected ? colors.accent : colors.card,
                  borderColor: selected ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
              accessibilityLabel={`Select category ${category.name}`}
            >
              <Text style={{ color: selected ? palette.navy : colors.text, fontWeight: '600' }}>
                {category.icon} {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {categories.length === 0 ? (
        <Text style={[styles.help, { color: colors.secondaryText }]}>Create a category first from Settings.</Text>
      ) : null}
      <View style={styles.row}>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Cancel habit form"
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={() => void onSave()}
          accessibilityLabel="Save habit"
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
  error: { marginTop: -4, marginBottom: 8 },
  section: { fontWeight: '700', marginBottom: 8 },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  help: { marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 16 },
});
