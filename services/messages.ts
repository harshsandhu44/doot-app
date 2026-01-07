import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface Conversation {
  matchId: string;
  lastMessage?: Message;
  unreadCount: number;
}

// Send a message
export async function sendMessage(
  matchId: string,
  senderId: string,
  receiverId: string,
  text: string
): Promise<Message> {
  try {
    const messagesRef = collection(db, "messages");
    const messageData = {
      matchId,
      senderId,
      receiverId,
      text,
      timestamp: Timestamp.now(),
      read: false,
    };

    const docRef = await addDoc(messagesRef, messageData);

    // Update last message in match document
    await updateDoc(doc(db, "matches", matchId), {
      lastMessage: {
        text,
        senderId,
        timestamp: messageData.timestamp,
      },
    });

    return {
      id: docRef.id,
      ...messageData,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Get messages for a match
export async function getMessages(matchId: string): Promise<Message[]> {
  try {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("matchId", "==", matchId),
      orderBy("timestamp", "asc")
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Message
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

// Subscribe to real-time messages
export function subscribeToMessages(
  matchId: string,
  callback: (messages: Message[]) => void
): () => void {
  try {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("matchId", "==", matchId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messages = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Message
        );
        callback(messages);
      },
      (error) => {
        console.error("Error in messages subscription:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to messages:", error);
    return () => {};
  }
}

// Mark messages as read
export async function markMessagesAsRead(
  matchId: string,
  userId: string
): Promise<void> {
  try {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("matchId", "==", matchId),
      where("receiverId", "==", userId),
      where("read", "==", false)
    );

    const messagesSnapshot = await getDocs(messagesQuery);

    const updatePromises = messagesSnapshot.docs.map((docSnapshot) =>
      updateDoc(doc(db, "messages", docSnapshot.id), { read: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
}

// Get unread message count for a match
export async function getUnreadCount(
  matchId: string,
  userId: string
): Promise<number> {
  try {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      where("matchId", "==", matchId),
      where("receiverId", "==", userId),
      where("read", "==", false)
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.size;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

// Get conversations (matches with last message info)
export async function getConversations(
  userId: string,
  matchIds: string[]
): Promise<Conversation[]> {
  try {
    const conversations: Conversation[] = [];

    for (const matchId of matchIds) {
      const messagesRef = collection(db, "messages");
      const messagesQuery = query(
        messagesRef,
        where("matchId", "==", matchId),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      const lastMessage = messagesSnapshot.docs[0]
        ? ({
            id: messagesSnapshot.docs[0].id,
            ...messagesSnapshot.docs[0].data(),
          } as Message)
        : undefined;

      const unreadCount = await getUnreadCount(matchId, userId);

      conversations.push({
        matchId,
        lastMessage,
        unreadCount,
      });
    }

    // Sort by last message timestamp
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp.toMillis() || 0;
      const bTime = b.lastMessage?.timestamp.toMillis() || 0;
      return bTime - aTime;
    });

    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}
