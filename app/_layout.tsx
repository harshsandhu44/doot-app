import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "../contexts/auth-context";
import { lightTheme, darkTheme } from "../config/theme";
import { getUserProfile } from "../services/firestore";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    if (loading || checkingOnboarding) return;

    const checkOnboardingStatus = async () => {
      const inAuthGroup = segments[0] === "(auth)";
      const inOnboardingGroup = segments[0] === "(onboarding)";

      // Not authenticated
      if (!user && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      // User is authenticated - check onboarding status
      if (user && !inOnboardingGroup) {
        setCheckingOnboarding(true);
        try {
          const profile = await getUserProfile(user.uid);

          if (!profile || !profile.metadata.onboardingCompleted) {
            // User needs to complete onboarding
            if (!inOnboardingGroup) {
              router.replace("/(onboarding)/step-1");
            }
          } else {
            // User has completed onboarding
            if (inAuthGroup) {
              // Coming from auth screens, redirect to main app
              router.replace("/(tabs)");
            }
            // Otherwise, let them stay where they are
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          // If there's an error fetching profile, assume they need onboarding
          if (!inOnboardingGroup) {
            router.replace("/(onboarding)/step-1");
          }
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboardingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          headerTitle: "Settings",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </PaperProvider>
  );
}
