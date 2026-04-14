import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsTab() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [notificationsOn, setNotificationsOn] = useState(false);

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      accessibilityLabel="Settings screen"
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.secondaryText }]}>Username</Text>
        <Text style={[styles.value, { color: colors.text }]} accessibilityLabel="Current username">
          {user?.username ?? '—'}
        </Text>
      </View>

      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>Dark mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.accent }}
          accessibilityLabel="Toggle dark mode"
        />
      </View>

      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>Daily reminder (8pm)</Text>
        <Switch
          value={notificationsOn}
          onValueChange={setNotificationsOn}
          trackColor={{ false: colors.border, true: colors.accent }}
          accessibilityLabel="Toggle daily habit reminder"
        />
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push('/categories')}
        accessibilityLabel="Manage categories"
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>Manage Categories</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => {
          Alert.alert('Log out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out' },
          ]);
        }}
        accessibilityLabel="Log out"
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { color: palette.navy }]}>Log out</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: palette.danger }]}
        onPress={() => {
          Alert.alert(
            'Delete account',
            'All habits, logs, categories, and targets will be permanently erased.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive' },
            ],
          );
        }}
        accessibilityLabel="Delete account"
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { color: palette.white }]}>Delete Account</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16 },
  label: { fontSize: 13, marginBottom: 4 },
  value: { fontSize: 20, fontWeight: '700' },
  row: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 12 },
  button: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
