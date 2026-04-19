import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Index() {
  const { user, isReady } = useAuth();
  const { colors } = useTheme();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!isReady || !user) {
      setOnboardingChecked(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEYS.onboardingDone);
        if (!cancelled) {
          setNeedsOnboarding(v !== 'true');
          setOnboardingChecked(true);
        }
      } catch {
        if (!cancelled) {
          setNeedsOnboarding(true);
          setOnboardingChecked(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, user]);

  if (!isReady) {
    return (
      <View
        style={[styles.centered, { backgroundColor: colors.background }]}
        accessibilityLabel="Loading application"
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
          accessibilityLabel="Loading indicator"
        />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingChecked) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} accessibilityLabel="Loading" />
      </View>
    );
  }

  if (needsOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/habits" />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
