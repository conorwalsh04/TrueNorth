import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { palette } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCategories } from '../hooks/useCategories';
import { hapticSuccess } from '../utils/haptics';

const PRESET_ICONS = ['🏃', '📚', '🥗', '🧘', '💪', '🎯', '💡', '❤️'] as const;
const PRESET_COLOURS = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#9B59B6',
  '#F39C12',
  '#1ABC9C',
  '#E67E22',
  '#F2A71B',
] as const;

export default function CategoryFormScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { categories, addCategory, updateCategory } = useCategories(user?.id ?? 0);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(PRESET_ICONS[0]);
  const [colour, setColour] = useState<string>(PRESET_COLOURS[0]);
  const [error, setError] = useState('');

  const editing = useMemo(
    () => categories.find((category) => category.id === Number(id)),
    [categories, id],
  );

  useEffect(() => {
    if (!editing) return;
    setName(editing.name);
    setIcon(editing.icon);
    setColour(editing.colour);
  }, [editing]);

  const onSave = async () => {
    setError('');
    if (!user) return;
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    const payload = {
      name: name.trim(),
      icon,
      colour,
      userId: user.id,
    };

    if (editing) {
      await updateCategory(editing.id, payload);
    } else {
      await addCategory(payload);
    }
    await hapticSuccess();
    router.back();
  };

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Category form"
    >
      <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
        {editing ? 'Edit category' : 'Category'}
      </Text>
      <FormField label="Name" placeholder="Category name" value={name} onChangeText={setName} />
      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}
      <Text style={[styles.section, { color: colors.text }]}>Icon</Text>
      <View style={styles.iconRow}>
        {PRESET_ICONS.map((e) => (
          <Pressable
            key={e}
            onPress={() => setIcon(e)}
            style={[
              styles.iconBtn,
              { backgroundColor: colors.card, borderColor: icon === e ? colors.accent : colors.border },
            ]}
            accessibilityLabel={`Select icon ${e}`}
            accessibilityRole="button"
          >
            <Text style={styles.iconEmoji}>{e}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.section, { color: colors.text }]}>Colour</Text>
      <View style={styles.colourRow}>
        {PRESET_COLOURS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColour(c)}
            style={[
              styles.swatch,
              { backgroundColor: c },
              colour === c && { borderColor: colors.text, borderWidth: 2 },
            ]}
            accessibilityLabel={`Select colour ${c}`}
            accessibilityRole="button"
          />
        ))}
      </View>
      <View style={styles.row}>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Cancel category form"
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={() => void onSave()}
          accessibilityLabel="Save category"
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
  section: { fontWeight: '700', marginTop: 12, marginBottom: 8 },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconBtn: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconEmoji: { fontSize: 24 },
  colourRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 36, height: 36, borderRadius: 18 },
  row: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 16 },
});
