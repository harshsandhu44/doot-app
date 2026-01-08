import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform, TextInput, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import { Button } from "../../components/button";
import { InterestChip } from "../../components/interest-chip";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";

const INTEREST_OPTIONS = [
  "Travel", "Music", "Movies", "Sports", "Fitness", "Cooking", "Reading", "Gaming", "Art",
  "Photography", "Hiking", "Yoga", "Dancing", "Food", "Coffee", "Wine", "Technology",
  "Fashion", "Pets", "Netflix"
];

export default function Step5() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [bio, setBio] = useState(data.bio || "");
  const [interests, setInterests] = useState<string[]>(data.interests || []);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      if (interests.length >= 10) {
        setError("You can select up to 10 interests");
        return;
      }
      setInterests([...interests, interest]);
      setError("");
    }
  };

  const validateAndNext = () => {
    if (!bio.trim() || bio.trim().length < 10) return setError("Bio must be at least 10 characters");
    if (interests.length < 3) return setError("Please select at least 3 interests");

    updateData({ bio, interests });
    router.push("/(onboarding)/step-6");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Express yourself</Text>
        <Text style={styles.subtitle}>Write a short bio and pick your interests</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            placeholder="Tell people a bit about yourself..."
            value={bio}
            onChangeText={setBio}
            style={styles.bioInput}
            multiline
            numberOfLines={4}
            maxLength={500}
            placeholderTextColor={COLORS.textSecondary}
          />
          <Text style={styles.charCount}>{bio.length}/500</Text>

          <View style={styles.interestsHeader}>
            <Text style={styles.label}>Interests</Text>
            <Text style={styles.interestsCount}>{interests.length}/10</Text>
          </View>
          
          <View style={styles.interestsGrid}>
            {INTEREST_OPTIONS.map((interest) => (
              <TouchableOpacity key={interest} onPress={() => toggleInterest(interest)}>
                <InterestChip
                  label={interest}
                  selected={interests.includes(interest)}
                  style={styles.chip}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={validateAndNext}
          disabled={!bio.trim() || interests.length < 3}
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
    gap: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bioInput: {
    minHeight: 120,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    ...TYPOGRAPHY.body,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlignVertical: 'top',
  },
  charCount: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: -SPACING.sm,
  },
  interestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  interestsCount: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    marginRight: 0,
    marginBottom: 0,
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