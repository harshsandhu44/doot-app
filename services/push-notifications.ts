import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserProfile } from "../models/user";

// Expo Push Notification API endpoint
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushNotificationData {
  to: string;
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
  channelId?: string;
  priority?: "default" | "normal" | "high";
}

// Send push notification via Expo Push API
async function sendPushNotification(
  notification: PushNotificationData,
): Promise<void> {
  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...notification,
        sound: notification.sound || "default",
        priority: notification.priority || "high",
      }),
    });

    const result = await response.json();
    
    if (result.data?.status === "error") {
      console.error("Push notification error:", result.data.message);
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

// Send notification for a new match
export async function sendMatchNotification(
  matchedUserId: string,
  currentUserId: string,
): Promise<void> {
  try {
    // Get both users' profiles
    const [matchedUserDoc, currentUserDoc] = await Promise.all([
      getDoc(doc(db, "users", matchedUserId)),
      getDoc(doc(db, "users", currentUserId)),
    ]);

    if (!matchedUserDoc.exists() || !currentUserDoc.exists()) {
      console.error("User profile not found");
      return;
    }

    const matchedUser = matchedUserDoc.data() as UserProfile;
    const currentUser = currentUserDoc.data() as UserProfile;

    // Check if matched user has a push token
    if (!matchedUser.metadata.pushToken) {
      console.log("Matched user does not have a push token");
      return;
    }

    // Send notification to matched user
    await sendPushNotification({
      to: matchedUser.metadata.pushToken,
      title: "It's a Match!",
      body: `You and ${currentUser.profile.name} liked each other!`,
      data: {
        type: "match",
        matchId: [currentUserId, matchedUserId].sort().join("_"),
        userId: currentUserId,
      },
      badge: 1,
      channelId: "default",
    });
  } catch (error) {
    console.error("Error sending match notification:", error);
  }
}

// Send notification for a new message
export async function sendMessageNotification(
  receiverId: string,
  senderId: string,
  matchId: string,
  messageText: string,
): Promise<void> {
  try {
    // Get both users' profiles
    const [receiverDoc, senderDoc] = await Promise.all([
      getDoc(doc(db, "users", receiverId)),
      getDoc(doc(db, "users", senderId)),
    ]);

    if (!receiverDoc.exists() || !senderDoc.exists()) {
      console.error("User profile not found");
      return;
    }

    const receiver = receiverDoc.data() as UserProfile;
    const sender = senderDoc.data() as UserProfile;

    // Check if receiver has a push token
    if (!receiver.metadata.pushToken) {
      console.log("Receiver does not have a push token");
      return;
    }

    // Truncate message if too long
    const truncatedMessage =
      messageText.length > 100
        ? `${messageText.substring(0, 100)}...`
        : messageText;

    // Send notification to receiver
    await sendPushNotification({
      to: receiver.metadata.pushToken,
      title: sender.profile.name,
      body: truncatedMessage,
      data: {
        type: "message",
        matchId,
        senderId,
      },
      badge: 1,
      channelId: "default",
    });
  } catch (error) {
    console.error("Error sending message notification:", error);
  }
}
