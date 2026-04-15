import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormField from '../../components/FormField';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      await register(username, password);
      router.replace('/(tabs)/habits');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Register scroll content"
      >
        <View style={styles.header}>
          <Text style={styles.logo} accessibilityLabel="TrueNorth logo">
            🧭
          </Text>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            Join TrueNorth
          </Text>
          <Text style={[styles.tagline, { color: colors.secondaryText }]}>
            Find Your True North
          </Text>
        </View>

        <FormField
          label="Username"
          placeholder="Choose a username"
          value={username}
          onChangeText={(t) => {
            setUsername(t);
            setError('');
          }}
        />
        <FormField
          label="Password"
          placeholder="Choose a password"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError('');
          }}
          secureTextEntry
        />

        {error ? (
          <Text style={[styles.error, { color: palette.danger }]} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
          onPress={() => void onRegister()}
          disabled={loading}
          accessibilityLabel="Register account"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color={palette.navy} accessibilityLabel="Creating account" />
          ) : (
            <Text style={styles.primaryButtonText}>Register</Text>
          )}
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable
            style={styles.linkWrap}
            accessibilityLabel="Back to login"
            accessibilityRole="link"
          >
            <Text style={[styles.link, { color: colors.accent }]}>
              Already have an account? Log in
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 72, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700' },
  tagline: { fontSize: 16, marginTop: 8 },
  error: { marginBottom: 12, textAlign: 'center' },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#0D1B2A', fontWeight: '700', fontSize: 16 },
  linkWrap: { marginTop: 20, alignItems: 'center' },
  link: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
