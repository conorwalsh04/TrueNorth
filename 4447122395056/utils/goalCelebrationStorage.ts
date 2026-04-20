import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = 'truenorth_celebrated_target_';

export function celebrationKey(targetId: number, periodKey: string): string {
  return `${prefix}${targetId}_${periodKey}`;
}

export async function hasCelebratedTarget(targetId: number, periodKey: string): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(celebrationKey(targetId, periodKey));
    return v === '1';
  } catch {
    return false;
  }
}

export async function markTargetCelebrated(targetId: number, periodKey: string): Promise<void> {
  try {
    await AsyncStorage.setItem(celebrationKey(targetId, periodKey), '1');
  } catch {
    /* ignore */
  }
}
