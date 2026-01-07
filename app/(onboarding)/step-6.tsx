import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Surface, TextInput, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import { useAuth } from "../../contexts/auth-context";
import { saveUserProfile } from "../../services/firestore";

export default function Step6() {
  const router = useRouter();
  const theme = useTheme();
  const { data, resetData } = useOnboarding();
  const { user } = useAuth();

  const [height, setHeight] = useState(data.height?.toString() || "");
  const [education, setEducation] = useState(data.education || "");
  const [occupation, setOccupation] = useState(data.occupation || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const completeOnboarding = async (skipOptional: boolean = false) => {
    setLoading(true);
    setError("");

    try {
      // Validate height if provided
      const heightValue = skipOptional
        ? undefined
        : height
          ? parseInt(height, 10)
          : undefined;

      if (height && (!heightValue || heightValue < 100 || heightValue > 250)) {
        setError("Please enter a valid height between 100-250 cm");
        setLoading(false);
        return;
      }

      // Update final data
      const finalData = {
        ...data,
        height: heightValue,
        education: skipOptional ? undefined : education || undefined,
        occupation: skipOptional ? undefined : occupation || undefined,
      };

      // Save to Firestore
      if (!user) {
        throw new Error("User not authenticated");
      }

      await saveUserProfile(user.uid, user.email, finalData);

      // Reset onboarding data
      resetData();

      // Navigate to main app
      router.replace("/(tabs)");

      Alert.alert("Welcome!", "Your profile has been created successfully", [
        { text: "OK" },
      ]);
    } catch (err: any) {
      console.error("Error completing onboarding:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    completeOnboarding(false);
  };

  const handleSkip = () => {
    completeOnboarding(true);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Optional Details
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Add more details to your profile (you can skip this step)
          </Text>

          {error ? (
            <Surface
              style={[
                styles.errorContainer,
                { backgroundColor: theme.colors.errorContainer },
              ]}
            >
              <Text style={{ color: theme.colors.onErrorContainer }}>
                {error}
              </Text>
            </Surface>
          ) : null}

          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="Height (cm)"
              value={height}
              onChangeText={setHeight}
              placeholder="e.g., 175"
              keyboardType="numeric"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              mode="outlined"
              label="Education"
              value={education}
              onChangeText={setEducation}
              placeholder="e.g., Bachelor's Degree"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              mode="outlined"
              label="Occupation"
              value={occupation}
              onChangeText={setOccupation}
              placeholder="e.g., Software Engineer"
              style={styles.input}
              disabled={loading}
            />
          </View>

          <Text
            variant="bodySmall"
            style={[
              styles.helperText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            These details are optional and can be added later from your profile
            settings
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              mode="outlined"
              onPress={handleSkip}
              style={styles.skipButton}
              disabled={loading}
            >
              Skip
            </Button>
            <Button
              mode="contained"
              onPress={handleComplete}
              style={styles.completeButton}
              loading={loading}
              disabled={loading}
            >
              Complete
            </Button>
          </View>
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    marginBottom: 32,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  helperText: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: "auto",
  },
  backButton: {
    flex: 1,
  },
  skipButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
  },
});
