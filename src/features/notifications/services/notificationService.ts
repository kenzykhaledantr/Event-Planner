import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase.config';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('event-reminders', {
        name: 'Event Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7C3AED',
      });
    }

    return finalStatus === 'granted';
  },

  async scheduleEventReminder(eventId: string, eventTitle: string, startTime: Date): Promise<string | null> {
    const permissionGranted = await this.requestPermissions();
    if (!permissionGranted) return null;

    const reminderTime = new Date(startTime.getTime() - 60 * 60 * 1000); // 1 hour before
    if (reminderTime <= new Date()) return null; // Event starts too soon (or already started) to schedule a meaningful reminder.

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Starting Soon',
        body: `${eventTitle} starts in an hour.`,
        data: { eventId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
        channelId: 'event-reminders',
      },
    });

    return notificationId;
  },

  async cancelReminder(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    },
  // Add to notificationService:


async saveReminderMapping(eventId: string, notificationId: string): Promise<void> {
  await SecureStore.setItemAsync(`reminder_${eventId}`, notificationId);
},

async getReminderMapping(eventId: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(`reminder_${eventId}`);
  } catch {
    return null;
  }
},

async clearReminderMapping(eventId: string): Promise<void> {
  await SecureStore.deleteItemAsync(`reminder_${eventId}`);
    },
// Add to notificationService:
async registerPushToken(uid: string): Promise<void> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });

  await updateDoc(doc(db, 'users', uid), { pushToken: tokenData.data });
},
};