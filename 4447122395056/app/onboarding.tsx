import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { space } from '../constants/spacing';
import { type as typeScale } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { hapticSuccess } from '../utils/haptics';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    title: 'Welcome to TrueNorth',
    body: 'Define habits by category, log activity each day, and build streaks that stick.',
  },
  {
    key: '2',
    title: 'Targets & insights',
    body: 'Set weekly or monthly goals — for all habits, one habit, or a whole category. Charts show how you are doing over time.',
  },
  {
    key: '3',
    title: 'Your data stays on device',
    body: 'Everything is stored locally in SQLite. Optional quotes use an API key from your .env file — never committed to git.',
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const listRef = useRef<FlatList>(null);

  const finish = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.onboardingDone, 'true');
    await hapticSuccess();
    router.replace('/(tabs)/habits');
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setPage(Math.round(x / Math.max(WINDOW_WIDTH, 1)));
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.hero}>
        <Image
          source={require('../assets/truenorth-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="TrueNorth logo"
        />
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        getItemLayout={(_, index) => ({
          length: WINDOW_WIDTH,
          offset: WINDOW_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: WINDOW_WIDTH }]}>
            <Text style={[typeScale.screenTitle, { color: colors.text, marginBottom: space.md, textAlign: 'center' }]}>
              {item.title}
            </Text>
            <Text style={[typeScale.body, { color: colors.secondaryText, textAlign: 'center', lineHeight: 24 }]}>
              {item.body}
            </Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((s, i) => (
          <View
            key={s.key}
            style={[
              styles.dot,
              { backgroundColor: i === page ? colors.accent : colors.border },
            ]}
          />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        {page < SLIDES.length - 1 ? (
          <Pressable
            style={[styles.secondary, { borderColor: colors.border }]}
            onPress={() =>
              listRef.current?.scrollToOffset({
                offset: (page + 1) * WINDOW_WIDTH,
                animated: true,
              })
            }
            accessibilityLabel="Next onboarding slide"
            accessibilityRole="button"
          >
            <Text style={[typeScale.bodyStrong, { color: colors.text }]}>Next</Text>
          </Pressable>
        ) : null}
        <Pressable
          style={[styles.primary, { backgroundColor: colors.accent }]}
          onPress={() => void finish()}
          accessibilityLabel="Get started with TrueNorth"
          accessibilityRole="button"
        >
          <Text style={[typeScale.bodyStrong, { color: '#0D1B2A' }]}>Get started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { alignItems: 'center', paddingVertical: space.lg },
  logo: { width: 96, height: 96 },
  slide: {
    paddingHorizontal: space.lg,
    justifyContent: 'center',
    minHeight: 200,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: space.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  footer: { paddingHorizontal: space.lg, gap: space.sm },
  primary: {
    paddingVertical: space.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: {
    paddingVertical: space.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: space.xs,
  },
});
