import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import Slider from "@react-native-community/slider";
import { Button } from "../../components/button";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";

export default function Step4() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [lookingFor, setLookingFor] = useState(data.preferences?.lookingFor || "");
  const [ageMin, setAgeMin] = useState(data.preferences?.ageRange.min || 18);
  const [ageMax, setAgeMax] = useState(data.preferences?.ageRange.max || 30);
  const [distanceRadius, setDistanceRadius] = useState(data.preferences?.distanceRadius || 50);

  const validateAndNext = () => {
    updateData({
      preferences: {
        lookingFor: lookingFor as "male" | "female" | "everyone",
        ageRange: { min: ageMin, max: ageMax },
        distanceRadius,
      },
    });
    router.push("/(onboarding)/step-5");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Who do you want to meet?</Text>
        <Text style={styles.subtitle}>You can change these later in settings</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Looking for</Text>
          <View style={styles.optionsGrid}>
            {[
              { value: "male", label: "Men" },
              { value: "female", label: "Women" },
              { value: "everyone", label: "Everyone" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  lookingFor === option.value && styles.optionButtonSelected
                ]}
                onPress={() => setLookingFor(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  lookingFor === option.value && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.label}>Age range</Text>
              <Text style={styles.rangeValue}>{ageMin} - {ageMax}</Text>
            </View>
            
            <View style={styles.rangeSliderContainer}>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Min: {ageMin}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={80}
                  step={1}
                  value={ageMin}
                  onValueChange={(val) => {
                    setAgeMin(val);
                    if (val > ageMax) setAgeMax(val);
                  }}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.primary}
                />
              </View>

              <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Max: {ageMax}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={80}
                  step={1}
                  value={ageMax}
                  onValueChange={(val) => {
                    setAgeMax(val);
                    if (val < ageMin) setAgeMin(val);
                  }}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.primary}
                />
              </View>
            </View>
          </View>

          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.label}>Maximum distance</Text>
              <Text style={styles.rangeValue}>{distanceRadius} km</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={200}
              step={5}
              value={distanceRadius}
              onValueChange={setDistanceRadius}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={validateAndNext}
          disabled={!lookingFor}
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
    gap: SPACING.xl,
  },
  label: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.white,
  },
  sliderSection: {
    gap: SPACING.sm,
  },
  rangeSliderContainer: {
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  sliderRow: {
    gap: 0,
  },
  sliderLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: -4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rangeValue: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
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