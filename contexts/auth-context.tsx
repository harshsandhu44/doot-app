import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../config/firebase";
import { User } from "../models/user";
import { Platform } from "react-native";
import {
  registerForPushNotifications,
  savePushToken,
  removePushToken,
  setupNotificationListeners,
} from "../services/notifications";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configure Google Sign-In
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            emailVerified: firebaseUser.emailVerified,
            createdAt: firebaseUser.metadata.creationTime,
          };
          setUser(user);

          // Register for push notifications
          try {
            const pushToken = await registerForPushNotifications();
            if (pushToken) {
              await savePushToken(firebaseUser.uid, pushToken);
            }
          } catch (error) {
            console.error("Error registering push notifications:", error);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  // Setup notification listeners
  useEffect(() => {
    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log("Foreground notification:", notification);
      },
      (response) => {
        console.log("Notification tapped:", response);
        // Handle notification tap - navigate to appropriate screen
        const data = response.notification.request.content.data;
        if (data?.type === "match") {
          // Navigate to matches screen
          console.log("Navigate to match:", data.matchId);
        } else if (data?.type === "message") {
          // Navigate to chat screen
          console.log("Navigate to chat:", data.matchId);
        }
      },
    );

    return cleanup;
  }, []);

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) => {
        console.error("Google Sign-In credential error:", err);
        setError(err.message || "Failed to sign in with Google");
      });
    }
  }, [response]);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Remove push token before signing out
      if (user) {
        try {
          await removePushToken(user.uid);
        } catch (error) {
          console.error("Error removing push token:", error);
        }
      }
      
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);

      // Use popup for web, Expo auth session for native
      if (Platform.OS === "web") {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        setLoading(false);
      } else {
        // Trigger Expo's Google auth flow for mobile
        await promptAsync();
      }
    } catch (err: any) {
      console.log("[GOOGLE SIGN_IN]: ", err.message);
      setError(err.message || "Failed to sign in with Google");
      setLoading(false);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
