import React from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { OnboardingProvider } from "../../contexts/onboarding-context";
import { ProgressBar } from "../../components/progress-bar";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

function ProgressHeader() {
  const pathname = usePathname();
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;
  const totalSteps = 6;

  return (
    <View style={styles.progressContainer}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    </View>
  );
}

export default function OnboardingLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const stepMatch = pathname.match(/step-(\d+)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1;

  const isOptional = currentStep === 4 || currentStep === 5; // Example optional steps

  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: () => <ProgressHeader />,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerLeft: () => (
            currentStep > 1 ? (
              <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                <Ionicons name="chevron-back" size={24} color={COLORS.text} />
              </TouchableOpacity>
            ) : null
          ),
          headerRight: () => (
            isOptional ? (
              <TouchableOpacity 
                onPress={() => router.push(`/step-${currentStep + 1}` as any)} 
                style={styles.headerButton}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            ) : null
          ),
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
    width: 200,
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.sm,
  },
  skipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});