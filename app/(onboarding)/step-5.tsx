import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Text,
  Button,
  Surface,
  TextInput,
  Chip,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";

const INTEREST_OPTIONS = [
  "Travel",
  "Music",
  "Movies",
  "Sports",
  "Fitness",
  "Cooking",
  "Reading",
  "Gaming",
  "Art",
  "Photography",
  "Hiking",
  "Yoga",
  "Dancing",
  "Food",
  "Coffee",
  "Wine",
  "Technology",
  "Fashion",
  "Pets",
  "Netflix",
];

export default function Step5() {
  const router = useRouter();
  const theme = useTheme();
  const { data, updateData } = useOnboarding();

  const [bio, setBio] = useState(data.bio);
  const [interests, setInterests] = useState<string[]>(data.interests);
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
    setError("");

    if (!bio.trim()) {
      setError("Please write a bio");
      return;
    }

    if (bio.trim().length < 20) {
      setError("Bio must be at least 20 characters");
      return;
    }

    if (bio.trim().length > 500) {
      setError("Bio must be less than 500 characters");
      return;
    }

    if (interests.length < 3) {
      setError("Please select at least 3 interests");
      return;
    }

    // Save data and navigate
    updateData({ bio, interests });
    router.push("/(onboarding)/step-6");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            About You
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Tell us about yourself and your interests
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
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Bio
              </Text>
              <TextInput
                mode="outlined"
                value={bio}
                onChangeText={setBio}
                placeholder="Tell people a bit about yourself..."
                multiline
                numberOfLines={6}
                style={styles.bioInput}
                maxLength={500}
              />
              <Text
                variant="bodySmall"
                style={[styles.charCount, { color: theme.colors.onSurfaceVariant }]}
              >
                {bio.length}/500 characters
              </Text>
            </View>

            <View style={styles.section}>
              <View style={styles.interestsHeader}>
                <Text variant="titleMedium">Interests</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {interests.length}/10 selected (min 3)
                </Text>
              </View>
              
              <View style={styles.interestsContainer}>
                {INTEREST_OPTIONS.map((interest) => (
                  <Chip
                    key={interest}
                    selected={interests.includes(interest)}
                    onPress={() => toggleInterest(interest)}
                    style={styles.chip}
                    mode="outlined"
                  >
                    {interest}
                  </Chip>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
            >
              Back
            </Button>
            <Button
              mode="contained"
              onPress={validateAndNext}
              style={styles.nextButton}
              disabled={!bio.trim() || interests.length < 3}
            >
              Next
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
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  bioInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    marginTop: -8,
  },
  interestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingBottom: 24,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
