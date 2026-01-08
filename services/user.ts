import { doc, getDoc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { UserProfile } from "../models/user";

// Check if user profile exists
async function profileExists(userId: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, "userProfiles", userId));
  return userDoc.exists();
}

// Get user profile by ID
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "userProfiles", userId));

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>,
): Promise<void> {
  try {
    const exists = await profileExists(userId);
    if (!exists) {
      throw new Error("User profile not found. Please complete onboarding first.");
    }
    
    await updateDoc(doc(db, "userProfiles", userId), {
      ...updates,
      "metadata.lastActive": Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Update user's basic profile info
export async function updateBasicInfo(
  userId: string,
  name: string,
  age: number,
  bio: string,
): Promise<void> {
  try {
    await updateDoc(doc(db, "userProfiles", userId), {
      "profile.name": name,
      "profile.age": age,
      "profile.bio": bio,
      "metadata.lastActive": Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating basic info:", error);
    throw error;
  }
}

// Update user's photos
export async function updatePhotos(
  userId: string,
  photos: string[],
): Promise<void> {
  try {
    await updateDoc(doc(db, "userProfiles", userId), {
      "profile.photos": photos,
      "metadata.lastActive": Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating photos:", error);
    throw error;
  }
}

// Update user's interests
export async function updateInterests(
  userId: string,
  interests: string[],
): Promise<void> {
  try {
    await updateDoc(doc(db, "userProfiles", userId), {
      "profile.interests": interests,
      "metadata.lastActive": Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating interests:", error);
    throw error;
  }
}

// Update user's preferences
export async function updatePreferences(
  userId: string,
  preferences: {
    lookingFor?: "male" | "female" | "everyone";
    ageRange?: { min: number; max: number };
    distanceRadius?: number;
  },
): Promise<void> {
  try {
    const exists = await profileExists(userId);
    if (!exists) {
      throw new Error("User profile not found. Please complete onboarding first.");
    }

    const updates: any = {
      "metadata.lastActive": Timestamp.now(),
    };

    if (preferences.lookingFor) {
      updates["preferences.lookingFor"] = preferences.lookingFor;
    }
    if (preferences.ageRange) {
      updates["preferences.ageRange"] = preferences.ageRange;
    }
    if (preferences.distanceRadius !== undefined) {
      updates["preferences.distanceRadius"] = preferences.distanceRadius;
    }

    await updateDoc(doc(db, "userProfiles", userId), updates);
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
}

// Update last active timestamp
export async function updateLastActive(userId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "userProfiles", userId), {
      "metadata.lastActive": Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating last active:", error);
  }
}
