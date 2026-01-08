import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

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
  notification: PushNotificationData
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

// Cloud Function: Send notification when a match is created
export const onMatchCreated = functions.firestore
  .document("matches/{matchId}")
  .onCreate(async (snap, context) => {
    const matchData = snap.data();
    const users = matchData.users as string[];

    if (users.length !== 2) {
      console.error("Invalid match: must have exactly 2 users");
      return;
    }

    try {
      // Get both users' profiles
      const [user1Doc, user2Doc] = await Promise.all([
        db.collection("users").doc(users[0]).get(),
        db.collection("users").doc(users[1]).get(),
      ]);

      if (!user1Doc.exists || !user2Doc.exists) {
        console.error("User profile not found");
        return;
      }

      const user1 = user1Doc.data();
      const user2 = user2Doc.data();

      // Send notifications to both users
      const notifications: Promise<void>[] = [];

      if (user1?.metadata?.pushToken) {
        notifications.push(
          sendPushNotification({
            to: user1.metadata.pushToken,
            title: "It's a Match!",
            body: `You and ${user2?.profile?.name || "someone"} liked each other!`,
            data: {
              type: "match",
              matchId: context.params.matchId,
              userId: users[1],
            },
            badge: 1,
            channelId: "default",
          })
        );
      }

      if (user2?.metadata?.pushToken) {
        notifications.push(
          sendPushNotification({
            to: user2.metadata.pushToken,
            title: "It's a Match!",
            body: `You and ${user1?.profile?.name || "someone"} liked each other!`,
            data: {
              type: "match",
              matchId: context.params.matchId,
              userId: users[0],
            },
            badge: 1,
            channelId: "default",
          })
        );
      }

      await Promise.all(notifications);
      console.log("Match notifications sent successfully");
    } catch (error) {
      console.error("Error sending match notifications:", error);
    }
  });

// Cloud Function: Send notification when a message is created
export const onMessageCreated = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const receiverId = messageData.receiverId;
    const senderId = messageData.senderId;
    const matchId = messageData.matchId;
    const messageText = messageData.text;

    try {
      // Get both users' profiles
      const [receiverDoc, senderDoc] = await Promise.all([
        db.collection("users").doc(receiverId).get(),
        db.collection("users").doc(senderId).get(),
      ]);

      if (!receiverDoc.exists || !senderDoc.exists) {
        console.error("User profile not found");
        return;
      }

      const receiver = receiverDoc.data();
      const sender = senderDoc.data();

      // Check if receiver has a push token
      if (!receiver?.metadata?.pushToken) {
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
        title: sender?.profile?.name || "New Message",
        body: truncatedMessage,
        data: {
          type: "message",
          matchId,
          senderId,
        },
        badge: 1,
        channelId: "default",
      });

      console.log("Message notification sent successfully");
    } catch (error) {
      console.error("Error sending message notification:", error);
    }
  });
