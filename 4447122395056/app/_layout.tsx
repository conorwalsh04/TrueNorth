import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { AuthProvider } from '../context/AuthContext';
import HeaderBrand from '../components/HeaderBrand';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { configureNotificationHandler, scheduleHabitReminder } from '../utils/notifications';

function RootNavigation() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            contentStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="habit-form"
          options={{
            headerShown: true,
            headerTitle: () => <HeaderBrand />,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="habit-log"
          options={{
            headerShown: true,
            headerTitle: () => <HeaderBrand />,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            headerShown: true,
            headerTitle: () => <HeaderBrand />,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="category-form"
          options={{
            headerShown: true,
            headerTitle: () => <HeaderBrand />,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="target-form"
          options={{
            headerShown: true,
            headerTitle: () => <HeaderBrand />,
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    configureNotificationHandler();
    void (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEYS.notificationsDaily);
        if (v === 'true') {
          await scheduleHabitReminder();
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
