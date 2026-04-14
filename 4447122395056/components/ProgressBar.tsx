import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export type ProgressBarProps = {
  progress: number;
  colour?: string;
};

function autoColour(progress: number): string {
  if (progress >= 0.9) return '#2ECC71';
  if (progress >= 0.5) return '#F39C12';
  return '#E74C3C';
}

export default function ProgressBar({ progress, colour }: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));
  const fillColour = colour ?? autoColour(clamped);

  return (
    <View style={styles.track} accessibilityLabel={`Progress ${Math.round(clamped * 100)} percent`}>
      <View
        style={[
          styles.trackInner,
          { backgroundColor: colors.border },
        ]}
      >
        <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: fillColour }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%' },
  trackInner: {
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 6 },
});
