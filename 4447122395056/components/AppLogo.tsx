import { Image, StyleSheet, View } from 'react-native';

type AppLogoProps = {
  /** Width and height in density-independent pixels */
  size?: number;
};

/**
 * TrueNorth compass mark — use on auth and marketing-style headers.
 * Asset: `assets/truenorth-logo.png` (replace when updating brand artwork).
 */
export default function AppLogo({ size = 120 }: AppLogoProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Image
        source={require('../assets/truenorth-logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel="TrueNorth compass logo"
        accessibilityRole="image"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
});
