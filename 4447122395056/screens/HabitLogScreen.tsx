import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { palette } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useLogs } from '../hooks/useLogs';
import { hapticSuccess } from '../utils/haptics';

export default function HabitLogScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { habitId } = useLocalSearchParams<{ habitId?: string }>();
  const numericHabitId = habitId ? Number(habitId) : undefined;
  const { logs, addLog, updateLog } = useLogs(numericHabitId);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [count, setCount] = useState('1');
  const [notes, setNotes] = useState('');

  const existingLog = useMemo(
    () => logs.find((l) => l.date === date && (numericHabitId == null || l.habitId === numericHabitId)),
    [logs, date, numericHabitId],
  );

  useEffect(() => {
    if (!existingLog) return;
    setCount(String(existingLog.count));
    setNotes(existingLog.notes ?? '');
  }, [existingLog]);

  const onSave = async () => {
    const parsedCount = Number(count) || 0;
    const safeHabitId = numericHabitId ?? logs[0]?.habitId;
    if (!safeHabitId) {
      router.back();
      return;
    }

    const payload = {
      habitId: safeHabitId,
      date,
      count: parsedCount > 0 ? parsedCount : 0,
      notes: notes.trim() || null,
      completed: parsedCount > 0 ? 1 : 0,
    };

    if (existingLog) {
      await updateLog(existingLog.id, payload);
    } else {
      await addLog(payload);
    }
    await hapticSuccess();
    router.back();
  };

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Habit log form"
    >
      <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
        Log activity{habitId ? ` · #${habitId}` : ''}
      </Text>
      <FormField label="Date (YYYY-MM-DD)" placeholder="2026-04-14" value={date} onChangeText={setDate} />
      <FormField label="Count" placeholder="1" value={count} onChangeText={setCount} keyboardType="numeric" />
      <FormField label="Notes" placeholder="Optional" value={notes} onChangeText={setNotes} />
      <View style={styles.row}>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.border }]}
          onPress={() => router.back()}
          accessibilityLabel="Cancel log"
          accessibilityRole="button"
        >
          <Text style={[styles.btnText, { color: colors.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={() => void onSave()}
          accessibilityLabel="Save log"
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
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 16 },
});
