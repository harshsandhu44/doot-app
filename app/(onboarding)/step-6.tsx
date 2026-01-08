import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform, TextInput, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import { useAuth } from "../../contexts/auth-context";
import { saveUserProfile } from "../../services/firestore";
import { Button } from "../../components/button";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Step6() {
  const router = useRouter();
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
      const heightValue = skipOptional ? undefined : height ? parseInt(height, 10) : undefined;
      
      const finalData = {
        ...data,
        height: heightValue,
        education: skipOptional ? undefined : education || undefined,
        occupation: skipOptional ? undefined : occupation || undefined,
      };

      if (!user) throw new Error("User not authenticated");

      await saveUserProfile(user.uid, user.email, finalData);
      resetData();
      router.replace("/(tabs)");
      Alert.alert("Welcome!", "Your profile has been created successfully");
    } catch (err: any) {
      console.error("Error completing onboarding:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Almost there!</Text>
        <Text style={styles.subtitle}>These details are optional, but help people get to know you better</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              placeholder="e.g., 175"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Education</Text>
            <TextInput
              placeholder="e.g., Bachelor's Degree"
              value={education}
              onChangeText={setEducation}
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              placeholder="e.g., Designer"
              value={occupation}
              onChangeText={setOccupation}
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        <View style={styles.tipContainer}>
          <Ionicons name="sparkles-outline" size={20} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Profiles with more info are 50% more likely to get a match!
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Complete Profile"
          onPress={() => completeOnboarding(false)}
          loading={loading}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 28,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    ...TYPOGRAPHY.body,
    backgroundColor: COLORS.surface,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    flex: 1,
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: COLORS.background,
  },
});