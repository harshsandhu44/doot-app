import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt?: string;
  // Onboarding data
  name?: string;
  age?: number;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Complete user profile schema for Firestore
export interface UserProfile {
  uid: string;
  email: string;
  profile: {
    name: string;
    dateOfBirth: Date;
    age: number;
    gender: "male" | "female" | "other";
    bio: string;
    photos: string[]; // Firebase Storage URLs
    location: {
      city: string;
      coordinates: { latitude: number; longitude: number };
    };
    interests: string[];
    height?: number; // in cm
    education?: string;
    occupation?: string;
  };
  preferences: {
    lookingFor: "male" | "female" | "everyone";
    ageRange: { min: number; max: number };
    distanceRadius: number; // in km
  };
  metadata: {
    createdAt: Timestamp;
    lastActive: Timestamp;
    profileComplete: boolean;
    onboardingCompleted: boolean;
  };
}

// Onboarding form data (for context state management)
export interface OnboardingData {
  // Step 1: Basic info
  name: string;
  dateOfBirth: Date | null;
  gender: "male" | "female" | "other" | "";
  
  // Step 2: Photos
  photos: string[]; // Local URIs initially, then Storage URLs
  
  // Step 3: Location
  location: {
    city: string;
    coordinates: { latitude: number; longitude: number } | null;
  };
  
  // Step 4: Preferences
  preferences: {
    lookingFor: "male" | "female" | "everyone" | "";
    ageRange: { min: number; max: number };
    distanceRadius: number;
  };
  
  // Step 5: Bio and interests
  bio: string;
  interests: string[];
  
  // Step 6: Optional details
  height?: number;
  education?: string;
  occupation?: string;
}
