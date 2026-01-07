import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  Timestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { app } from "../config/firebase";
import { UserProfile, OnboardingData } from "../models/user";

const db = getFirestore(app);
const storage = getStorage(app);

// Calculate age from date of birth
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}

// Upload photos to Firebase Storage
export async function uploadPhotos(
  userId: string, 
  photoUris: string[]
): Promise<string[]> {
  const uploadPromises = photoUris.map(async (uri, index) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create a storage reference
      const fileName = `photos/photo_${index}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `users/${userId}/${fileName}`);
      
      // Upload the blob
      await uploadBytes(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading photo ${index}:`, error);
      throw error;
    }
  });
  
  return Promise.all(uploadPromises);
}

// Create or update user profile in Firestore
export async function saveUserProfile(
  userId: string,
  email: string,
  onboardingData: OnboardingData
): Promise<void> {
  try {
    // Upload photos first (only if there are photos)
    const photoUrls = onboardingData.photos.length > 0 
      ? await uploadPhotos(userId, onboardingData.photos)
      : [];
    
    // Calculate age
    const age = onboardingData.dateOfBirth 
      ? calculateAge(onboardingData.dateOfBirth) 
      : 0;
    
    // Create base profile object
    const profileData: any = {
      name: onboardingData.name,
      dateOfBirth: onboardingData.dateOfBirth || new Date(),
      age,
      gender: onboardingData.gender as "male" | "female" | "other",
      bio: onboardingData.bio,
      photos: photoUrls,
      location: {
        city: onboardingData.location.city,
        coordinates: onboardingData.location.coordinates || { 
          latitude: 0, 
          longitude: 0 
        },
      },
      interests: onboardingData.interests,
    };

    // Add optional fields only if they have values
    if (onboardingData.height) {
      profileData.height = onboardingData.height;
    }
    if (onboardingData.education) {
      profileData.education = onboardingData.education;
    }
    if (onboardingData.occupation) {
      profileData.occupation = onboardingData.occupation;
    }

    // Create user profile document
    const userProfile: any = {
      uid: userId,
      email,
      profile: profileData,
      preferences: {
        lookingFor: onboardingData.preferences.lookingFor as "male" | "female" | "everyone",
        ageRange: onboardingData.preferences.ageRange,
        distanceRadius: onboardingData.preferences.distanceRadius,
      },
      metadata: {
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now(),
        profileComplete: true,
        onboardingCompleted: true,
      },
    };
    
    // Save to Firestore
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, userProfile);
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

// Get user profile from Firestore
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

// Update user's last active timestamp
export async function updateLastActive(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      "metadata.lastActive": Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating last active:", error);
    throw error;
  }
}
