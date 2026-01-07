import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Surface,
  SegmentedButtons,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import Slider from "@react-native-community/slider";

export default function Step4() {
  const router = useRouter();
  const theme = useTheme();
  const { data, updateData } = useOnboarding();

  const [lookingFor, setLookingFor] = useState(data.preferences.lookingFor);
  const [ageMin, setAgeMin] = useState(data.preferences.ageRange.min);
  const [ageMax, setAgeMax] = useState(data.preferences.ageRange.max);
  const [distanceRadius, setDistanceRadius] = useState(
    data.preferences.distanceRadius,
  );
  const [error, setError] = useState("");

  const validateAndNext = () => {
    setError("");

    if (!lookingFor) {
      setError("Please select who you're looking for");
      return;
    }

    if (ageMin >= ageMax) {
      setError("Maximum age must be greater than minimum age");
      return;
    }

    // Save data and navigate
    updateData({
      preferences: {
        lookingFor,
        ageRange: { min: ageMin, max: ageMax },
        distanceRadius,
      },
    });
    router.push("/(onboarding)/step-5");
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
            Preferences
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Tell us what you&apos;re looking for
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
                Looking for
              </Text>
              <SegmentedButtons
                value={lookingFor}
                onValueChange={setLookingFor}
                buttons={[
                  { value: "male", label: "Men" },
                  { value: "female", label: "Women" },
                  { value: "everyone", label: "Everyone" },
                ]}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium">Age Range</Text>
                <Text variant="bodyLarge" style={styles.rangeValue}>
                  {ageMin} - {ageMax}
                </Text>
              </View>

              <View style={styles.sliderContainer}>
                <Text variant="bodySmall" style={styles.sliderLabel}>
                  Min: {ageMin}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={100}
                  step={1}
                  value={ageMin}
                  onValueChange={setAgeMin}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.surfaceVariant}
                  thumbTintColor={theme.colors.primary}
                />
              </View>

              <View style={styles.sliderContainer}>
                <Text variant="bodySmall" style={styles.sliderLabel}>
                  Max: {ageMax}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={100}
                  step={1}
                  value={ageMax}
                  onValueChange={setAgeMax}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.surfaceVariant}
                  thumbTintColor={theme.colors.primary}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text variant="titleMedium">Maximum Distance</Text>
                <Text variant="bodyLarge" style={styles.rangeValue}>
                  {distanceRadius} km
                </Text>
              </View>

              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={200}
                step={1}
                value={distanceRadius}
                onValueChange={setDistanceRadius}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.surfaceVariant}
                thumbTintColor={theme.colors.primary}
              />
              <View style={styles.distanceLabels}>
                <Text variant="bodySmall">1 km</Text>
                <Text variant="bodySmall">200 km</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={goBack} style={styles.backButton}>
              Back
            </Button>
            <Button
              mode="contained"
              onPress={validateAndNext}
              style={styles.nextButton}
              disabled={!lookingFor}
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
    gap: 16,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rangeValue: {
    fontWeight: "bold",
  },
  sliderContainer: {
    gap: 8,
  },
  sliderLabel: {
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  distanceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
    paddingTop: 24,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
