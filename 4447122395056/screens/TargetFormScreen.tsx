import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { palette } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

export default function TargetFormScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [goal, setGoal] = useState('');

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
      <Text style={[styles.label, { color: colors.text }]}>Habit</Text>
      <View style={[styles.box, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={{ color: colors.secondaryText }}>Global (all habits)</Text>
      </View>
      <Text style={[styles.label, { color: colors.text }]}>Type</Text>
      <View style={styles.typeRow}>
        <Pressable
          style={[styles.typeChip, { borderColor: colors.accent, backgroundColor: colors.card }]}
          accessibilityLabel="Weekly target type"
          accessibilityRole="button"
        >
          <Text style={{ color: colors.text, fontWeight: '600' }}>Weekly</Text>
        </Pressable>
        <Pressable
          style={[styles.typeChip, { borderColor: colors.border, backgroundColor: colors.card }]}
          accessibilityLabel="Monthly target type"
          accessibilityRole="button"
        >
          <Text style={{ color: colors.text, fontWeight: '600' }}>Monthly</Text>
        </Pressable>
      </View>
      <FormField label="Goal count" placeholder="e.g. 7" value={goal} onChangeText={setGoal} keyboardType="numeric" />
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
          onPress={() => router.back()}
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
  box: { borderWidth: 1, borderRadius: 12, padding: 14 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  typeChip: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 16 },
});
