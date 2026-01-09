import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { UserProfile } from "../models/user";
import { sendMatchNotification } from "./push-notifications";

export interface SwipeAction {
  userId: string;
  targetUserId: string;
  action: "like" | "pass" | "superlike";
  timestamp: Timestamp;
}

export interface Match {
  id: string;
  users: string[];
  createdAt: Timestamp;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fetch potential profiles for swiping
export async function fetchProfiles(
  currentUserId: string,
  maxProfiles: number = 20,
): Promise<(UserProfile & { distance: number })[]> {
  try {
    // Get current user's profile and preferences
    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
    if (!currentUserDoc.exists()) {
      throw new Error("Current user profile not found");
    }

    const currentUser = currentUserDoc.data() as UserProfile;
    const { preferences, profile } = currentUser;

    // Get users already swiped on
    const swipesRef = collection(db, "swipes");
    const swipesQuery = query(swipesRef, where("userId", "==", currentUserId));
    const swipesSnapshot = await getDocs(swipesQuery);
    const swipedUserIds = new Set(
      swipesSnapshot.docs.map((doc) => doc.data().targetUserId),
    );

    // Query potential matches
    const usersRef = collection(db, "users");
    let usersQuery = query(
      usersRef,
      where("metadata.profileComplete", "==", true),
      orderBy("metadata.lastActive", "desc"),
      limit(maxProfiles + swipedUserIds.size + 1), // Extra to account for filtering
    );

    const usersSnapshot = await getDocs(usersQuery);
    const potentialProfiles: (UserProfile & { distance: number })[] = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data() as UserProfile;

      // Skip current user and already swiped users
      if (userData.uid === currentUserId || swipedUserIds.has(userData.uid)) {
        return;
      }

      // Check gender preference
      if (
        preferences.lookingFor !== "everyone" &&
        userData.profile.gender !== preferences.lookingFor
      ) {
        return;
      }

      // Check if user matches current user's gender preference
      if (
        userData.preferences.lookingFor !== "everyone" &&
        userData.preferences.lookingFor !== profile.gender
      ) {
        return;
      }

      // Check age range
      if (
        userData.profile.age < preferences.ageRange.min ||
        userData.profile.age > preferences.ageRange.max
      ) {
        return;
      }

      // Check if current user is in their age range
      if (
        profile.age < userData.preferences.ageRange.min ||
        profile.age > userData.preferences.ageRange.max
      ) {
        return;
      }

      // Calculate distance
      const distance = calculateDistance(
        profile.location.coordinates.latitude,
        profile.location.coordinates.longitude,
        userData.profile.location.coordinates.latitude,
        userData.profile.location.coordinates.longitude,
      );

      // Check distance preference
      if (
        distance > preferences.distanceRadius ||
        distance > userData.preferences.distanceRadius
      ) {
        return;
      }

      potentialProfiles.push({ ...userData, distance });
    });

    // Return up to maxProfiles
    return potentialProfiles.slice(0, maxProfiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
}

// Record a swipe action
export async function recordSwipe(
  userId: string,
  targetUserId: string,
  action: "like" | "pass" | "superlike",
): Promise<{ matched: boolean; matchId?: string }> {
  try {
    // Create swipe document
    const swipeId = `${userId}_${targetUserId}`;
    await setDoc(doc(db, "swipes", swipeId), {
      userId,
      targetUserId,
      action,
      timestamp: Timestamp.now(),
    });

    // If action is pass, no need to check for match
    if (action === "pass") {
      return { matched: false };
    }

    // Check if target user has liked current user
    const reverseSwipeId = `${targetUserId}_${userId}`;
    const reverseSwipeDoc = await getDoc(doc(db, "swipes", reverseSwipeId));

    if (
      reverseSwipeDoc.exists() &&
      (reverseSwipeDoc.data().action === "like" ||
        reverseSwipeDoc.data().action === "superlike")
    ) {
      // Create a match
      const matchId = await createMatch(userId, targetUserId);
      
      // Send push notifications to both users
      try {
        await Promise.all([
          sendMatchNotification(userId, targetUserId),
          sendMatchNotification(targetUserId, userId),
        ]);
      } catch (error) {
        console.error("Error sending match notifications:", error);
      }
      
      return { matched: true, matchId };
    }

    return { matched: false };
  } catch (error) {
    console.error("Error recording swipe:", error);
    throw error;
  }
}

// Create a match between two users
async function createMatch(userId1: string, userId2: string): Promise<string> {
  try {
    // Create match document with sorted user IDs for consistency
    const users = [userId1, userId2].sort();
    const matchId = `${users[0]}_${users[1]}`;

    await setDoc(doc(db, "matches", matchId), {
      users,
      createdAt: Timestamp.now(),
    });

    // Add match to both users' match lists
    await updateDoc(doc(db, "users", userId1), {
      "metadata.matches": arrayUnion(matchId),
    });
    await updateDoc(doc(db, "users", userId2), {
      "metadata.matches": arrayUnion(matchId),
    });

    return matchId;
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
}

// Check if two users have matched
export async function checkForMatch(
  userId: string,
  targetUserId: string,
): Promise<boolean> {
  try {
    const users = [userId, targetUserId].sort();
    const matchId = `${users[0]}_${users[1]}`;
    const matchDoc = await getDoc(doc(db, "matches", matchId));
    return matchDoc.exists();
  } catch (error) {
    console.error("Error checking for match:", error);
    return false;
  }
}
