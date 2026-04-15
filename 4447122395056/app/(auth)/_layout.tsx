import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AuthLayout() {
  const { user, isReady } = useAuth();
  const { colors } = useTheme();

  if (!isReady) {
    return (
      <View
        style={[styles.centered, { backgroundColor: colors.background }]}
        accessibilityLabel="Loading authentication"
      >
        <ActivityIndicator color={colors.accent} accessibilityLabel="Loading indicator" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/habits" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
