import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "../../components/button";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Step1() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [name, setName] = useState(data.name || "");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    data.dateOfBirth || new Date(2000, 0, 1),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(data.gender || "");
  const [error, setError] = useState("");

  const validateAndNext = () => {
    setError("");
    if (!name.trim()) return setError("Please enter your name");
    if (name.trim().length < 2) return setError("Name must be at least 2 characters");
    
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) return setError("You must be at least 18 years old");
    if (!gender) return setError("Please select your gender");

    updateData({ name, dateOfBirth, gender: gender as "male" | "female" | "other" });
    router.push("/(onboarding)/step-2");
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>What&apos;s your name?</Text>
          <Text style={styles.subtitle}>Let&apos;s start with the basics</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.label}>When is your birthday?</Text>
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.dateText}>{dateOfBirth.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderGrid}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    gender === g && styles.genderButtonSelected
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    gender === g && styles.genderButtonTextSelected
                  ]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={validateAndNext}
            disabled={!name || !gender}
          />
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    gap: SPACING.lg,
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
  label: {
    ...TYPOGRAPHY.heading,
    fontSize: 16,
    marginBottom: -SPACING.sm,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
  },
  dateText: {
    ...TYPOGRAPHY.body,
  },
  genderGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderButton: {
    flex: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  genderButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: COLORS.white,
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
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    textAlign: 'center',
  },
});