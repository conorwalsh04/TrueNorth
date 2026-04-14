import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function TabIcon({ emoji }: { emoji: string }) {
  return (
    <Text style={{ fontSize: 22 }} accessibilityLabel={`Tab icon ${emoji}`}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}
        accessibilityLabel="Loading tabs"
      >
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading indicator" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerTitle: 'TrueNorth 🧭',
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarLabel: 'Habits',
          tabBarIcon: () => <TabIcon emoji="🧭" />,
          tabBarAccessibilityLabel: 'Habits tab',
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarLabel: 'Insights',
          tabBarIcon: () => <TabIcon emoji="📊" />,
          tabBarAccessibilityLabel: 'Insights tab',
        }}
      />
      <Tabs.Screen
        name="targets"
        options={{
          title: 'Targets',
          tabBarLabel: 'Targets',
          tabBarIcon: () => <TabIcon emoji="🎯" />,
          tabBarAccessibilityLabel: 'Targets tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: () => <TabIcon emoji="⚙️" />,
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />
    </Tabs>
  );
}
