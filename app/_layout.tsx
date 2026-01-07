import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../contexts/auth-context";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inScreensAuth = segments[0] === "screens" && segments[1] === "auth";

    if (!user && !inAuthGroup && !inScreensAuth) {
      // Redirect to login if not authenticated
      router.replace("/screens/auth/login");
    } else if (user && (inAuthGroup || inScreensAuth)) {
      // Redirect to tabs if authenticated and in auth screens
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="screens/auth/login" />
      <Stack.Screen name="screens/auth/signup" />
      <Stack.Screen name="screens/auth/onboarding" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
