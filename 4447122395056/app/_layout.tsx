import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

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
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="habit-form"
          options={{
            headerShown: true,
            title: 'TrueNorth 🧭',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="habit-log"
          options={{
            headerShown: true,
            title: 'TrueNorth 🧭',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="categories"
          options={{
            headerShown: true,
            title: 'TrueNorth 🧭',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="category-form"
          options={{
            headerShown: true,
            title: 'TrueNorth 🧭',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="target-form"
          options={{
            headerShown: true,
            title: 'TrueNorth 🧭',
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
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </ThemeProvider>
  );
}
