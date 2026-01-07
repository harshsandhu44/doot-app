import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Text, TextInput, Button, Surface, useTheme } from "react-native-paper";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setLocalError("Name is required");
      return false;
    }
    if (!age.trim()) {
      setLocalError("Age is required");
      return false;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      setLocalError("Please enter a valid age");
      return false;
    }
    if (!bio.trim()) {
      setLocalError("Bio is required");
      return false;
    }
    if (bio.trim().length < 10) {
      setLocalError("Bio must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    setLocalError("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Here you would typically save the onboarding data to Firestore or your database
      // For now, we'll just navigate to the main app
      // You can implement this later based on your backend setup

      router.replace("/(tabs)");
    } catch (error: any) {
      setLocalError(error.message || "Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text variant="displaySmall" style={styles.title}>
              Complete Your Profile
            </Text>
            <Text
              variant="bodyLarge"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Tell us a bit about yourself
            </Text>

            {localError ? (
              <Surface
                style={[
                  styles.errorContainer,
                  { backgroundColor: theme.colors.errorContainer },
                ]}
              >
                <Text style={{ color: theme.colors.onErrorContainer }}>
                  {localError}
                </Text>
              </Surface>
            ) : null}

            <View style={styles.form}>
              <TextInput
                mode="outlined"
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                disabled={isLoading}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Age"
                placeholder="Enter your age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                disabled={isLoading}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Bio"
                placeholder="Tell us about yourself (min 10 characters)"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                disabled={isLoading}
                style={styles.textArea}
              />

              <Button
                mode="contained"
                onPress={handleComplete}
                disabled={isLoading}
                loading={isLoading}
                style={styles.button}
              >
                Complete Setup
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    marginBottom: 8,
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
    gap: 20,
  },
  input: {
    marginBottom: 8,
  },
  textArea: {
    marginBottom: 8,
    minHeight: 100,
  },
  button: {
    marginTop: 8,
  },
});
