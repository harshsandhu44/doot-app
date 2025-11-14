import { Stack } from 'expo-router';

/**
 * Root layout component for Expo Router
 * Manages the navigation stack for the entire app
 */
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
