import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Index() {
  const { user, isReady } = useAuth();
  const { colors } = useTheme();

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

  return <Redirect href="/(tabs)/habits" />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
