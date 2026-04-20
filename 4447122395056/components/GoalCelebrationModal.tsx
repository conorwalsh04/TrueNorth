import { useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { palette } from '../constants/colors';
import { space } from '../constants/spacing';
import { type as typeScale } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { hapticSuccess } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type GoalCelebrationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  /** When false, confetti is skipped (reduce motion). */
  allowConfetti: boolean;
  onDismiss: () => void;
};

export default function GoalCelebrationModal({
  visible,
  title,
  message,
  allowConfetti,
  onDismiss,
}: GoalCelebrationModalProps) {
  const { colors } = useTheme();

  useEffect(() => {
    if (!visible) return;
    void hapticSuccess();
  }, [visible]);

  const showConfetti = allowConfetti && Platform.OS !== 'web';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal
    >
      <View style={styles.backdrop} accessibilityLabel="Goal celebration dialog">
        {visible && showConfetti ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ConfettiCannon
              count={200}
              origin={{ x: SCREEN_WIDTH / 2, y: 24 }}
              fadeOut
              autoStart
              colors={[palette.gold, '#2ECC71', '#3498DB', '#E74C3C', '#9B59B6', '#1ABC9C']}
            />
          </View>
        ) : null}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              zIndex: 2,
            },
          ]}
        >
          <Text style={styles.emoji} accessible={false}>
            🎯
          </Text>
          <Text style={[typeScale.screenTitle, { color: colors.text, textAlign: 'center', marginBottom: space.sm }]}>
            {title}
          </Text>
          <Text style={[typeScale.body, { color: colors.secondaryText, textAlign: 'center', marginBottom: space.lg }]}>
            {message}
          </Text>
          <Pressable
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss celebration"
          >
            <Text style={[typeScale.bodyStrong, { color: palette.navy }]}>Awesome!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(13, 27, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.lg,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: space.xl,
    maxWidth: 360,
    width: '100%',
    alignItems: 'center',
  },
  emoji: { fontSize: 48, marginBottom: space.sm },
  button: {
    paddingVertical: space.sm,
    paddingHorizontal: space.xl,
    borderRadius: 14,
    minWidth: 160,
    alignItems: 'center',
  },
});
