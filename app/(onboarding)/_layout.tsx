import React from "react";
import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text, ProgressBar, useTheme } from "react-native-paper";
import { OnboardingProvider } from "../../contexts/onboarding-context";

function ProgressHeader() {
  const pathname = usePathname();
  const theme = useTheme();

  // Extract step number from pathname
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;
  const totalSteps = 6;
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.progressContainer}>
      <Text
        variant="labelLarge"
        style={[styles.progressText, { color: theme.colors.onSurface }]}
      >
        Step {currentStep} of {totalSteps}
      </Text>
      <ProgressBar
        progress={progress}
        style={styles.progressBar}
        color={theme.colors.primary}
      />
    </View>
  );
}

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: () => <ProgressHeader />,
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="step-1" />
        <Stack.Screen name="step-2" />
        <Stack.Screen name="step-3" />
        <Stack.Screen name="step-4" />
        <Stack.Screen name="step-5" />
        <Stack.Screen name="step-6" />
      </Stack>
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  progressText: {
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
});
