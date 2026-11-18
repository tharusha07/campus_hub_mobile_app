import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default notification presentation behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request permission from the operating system to send notifications.
 */
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to obtain notification permissions.');
    return false;
  }

  // Setup Android channel with high importance
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'UniEvents Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
    });
  }

  return true;
}

/**
 * Triggers an immediate local notification (e.g. "Event Bookmarked!").
 */
export async function triggerImmediateNotification(title, body, data = {}) {
  try {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission && Platform.OS !== 'web') {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'UniEvents Notification',
        body: body || 'You have an update from UniEvents.',
        data,
        sound: true,
      },
      trigger: null, // null trigger schedules immediately
    });

    return notificationId;
  } catch (error) {
    console.error('Error triggering immediate notification:', error);
    return null;
  }
}

/**
 * Triggers a scheduled local notification after a given number of seconds (e.g. timed reminder).
 */
export async function triggerScheduledNotification(title, body, seconds = 5, data = {}) {
  try {
    const hasPermission = await registerForPushNotificationsAsync();
    if (!hasPermission && Platform.OS !== 'web') {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'UniEvents Reminder',
        body: body || `This is your scheduled ${seconds}-second reminder.`,
        data,
        sound: true,
      },
      trigger: {
        seconds,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error triggering scheduled notification:', error);
    return null;
  }
}
