import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // Check if running on a physical device
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF4458",
      });
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    // Get the token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID,
    });

    return token.data;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

// Save push token to user profile
export async function savePushToken(
  userId: string,
  token: string,
): Promise<void> {
  try {
    await updateDoc(doc(db, "users", userId), {
      "metadata.pushToken": token,
    });
  } catch (error) {
    console.error("Error saving push token:", error);
    throw error;
  }
}

// Remove push token (on logout)
export async function removePushToken(userId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "users", userId), {
      "metadata.pushToken": null,
    });
  } catch (error) {
    console.error("Error removing push token:", error);
    throw error;
  }
}

// Schedule a local notification (for testing)
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: any,
): Promise<string> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Show immediately
    });
    return id;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    throw error;
  }
}

// Set up notification listeners
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void,
) {
  // Listener for when notification is received while app is foregrounded
  const receivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    },
  );

  // Listener for when user taps notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("Notification tapped:", response);
      if (onNotificationTapped) {
        onNotificationTapped(response);
      }
    },
  );

  // Return cleanup function
  return () => {
    receivedListener.remove();
    responseListener.remove();
  };
}

// Clear all notifications
export async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
}

// Get badge count
export async function getBadgeCount(): Promise<number> {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error("Error getting badge count:", error);
    return 0;
  }
}

// Set badge count
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error("Error setting badge count:", error);
  }
}
