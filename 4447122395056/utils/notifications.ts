import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';

export const DAILY_REMINDER_ID = 'truenorth-daily-reminder';

export function configureNotificationHandler(): void {
  if (Platform.OS === 'web') {
    return;
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Schedules a repeating local notification every day at 20:00 (device local time).
 * @returns whether permission was granted and scheduling succeeded
 */
export async function scheduleHabitReminder(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  const result =
    existing.status === 'granted'
      ? existing
      : await Notifications.requestPermissionsAsync();
  if (result.status !== 'granted') {
    return false;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  } catch {
    /* no prior schedule */
  }

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'TrueNorth 🧭',
      body: 'Find your True North — check in on your habits.',
      sound: true,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });

  return true;
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
}
