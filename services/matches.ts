import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { UserProfile } from "../models/user";

export interface Match {
  id: string;
  users: string[];
  createdAt: Timestamp;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  otherUser?: UserProfile;
}

// Get all matches for a user
export async function getMatches(userId: string): Promise<Match[]> {
  try {
    // Query matches where user is a participant
    const matchesRef = collection(db, "matches");
    const matchesQuery = query(
      matchesRef,
      where("users", "array-contains", userId),
      orderBy("createdAt", "desc")
    );

    const matchesSnapshot = await getDocs(matchesQuery);
    const matches: Match[] = [];

    // Fetch other user's profile for each match
    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = matchDoc.data();
      const otherUserId = matchData.users.find((id: string) => id !== userId);

      if (otherUserId) {
        const otherUserDoc = await getDoc(
          doc(db, "userProfiles", otherUserId)
        );

        if (otherUserDoc.exists()) {
          matches.push({
            id: matchDoc.id,
            users: matchData.users,
            createdAt: matchData.createdAt,
            lastMessage: matchData.lastMessage,
            otherUser: otherUserDoc.data() as UserProfile,
          });
        }
      }
    }

    return matches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
}

// Get a specific match by ID
export async function getMatchById(
  matchId: string,
  currentUserId: string
): Promise<Match | null> {
  try {
    const matchDoc = await getDoc(doc(db, "matches", matchId));

    if (!matchDoc.exists()) {
      return null;
    }

    const matchData = matchDoc.data();
    const otherUserId = matchData.users.find(
      (id: string) => id !== currentUserId
    );

    if (!otherUserId) {
      return null;
    }

    const otherUserDoc = await getDoc(doc(db, "userProfiles", otherUserId));

    if (!otherUserDoc.exists()) {
      return null;
    }

    return {
      id: matchDoc.id,
      users: matchData.users,
      createdAt: matchData.createdAt,
      lastMessage: matchData.lastMessage,
      otherUser: otherUserDoc.data() as UserProfile,
    };
  } catch (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
}

// Get recent matches (last 24 hours)
export async function getRecentMatches(userId: string): Promise<Match[]> {
  try {
    const allMatches = await getMatches(userId);
    const oneDayAgo = Timestamp.fromDate(
      new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return allMatches.filter(
      (match) => match.createdAt.seconds > oneDayAgo.seconds
    );
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    throw error;
  }
}
