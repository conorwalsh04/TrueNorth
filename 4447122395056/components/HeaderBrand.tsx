import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LOGO_DEFAULT = 28;
const LOGO_TAB = 34;

export type HeaderBrandProps = {
  /** Slightly larger logo in tab bar headers */
  variant?: 'default' | 'tab';
};

export default function HeaderBrand({ variant = 'default' }: HeaderBrandProps) {
  const { colors } = useTheme();
  const size = variant === 'tab' ? LOGO_TAB : LOGO_DEFAULT;

  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="TrueNorth">
      <Image
        source={require('../assets/truenorth-logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessible={false}
      />
      <Text style={[styles.title, { color: colors.text }]} accessible={false}>
        TrueNorth
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
