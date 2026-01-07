import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  SegmentedButtons,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Step1() {
  const router = useRouter();
  const theme = useTheme();
  const { data, updateData } = useOnboarding();

  const [name, setName] = useState(data.name);
  const [dateOfBirth, setDateOfBirth] = useState<Date>(
    data.dateOfBirth || new Date(2000, 0, 1),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(data.gender);
  const [error, setError] = useState("");

  const validateAndNext = () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!dateOfBirth) {
      setError("Please select your date of birth");
      return;
    }

    // Validate age (must be 18+)
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    const adjustedAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
        ? age - 1
        : age;

    if (adjustedAge < 18) {
      setError("You must be at least 18 years old");
      return;
    }

    if (adjustedAge > 100) {
      setError("Please enter a valid date of birth");
      return;
    }

    if (!gender) {
      setError("Please select your gender");
      return;
    }

    // Save data and navigate
    updateData({ name, dateOfBirth, gender });
    router.push("/(onboarding)/step-2");
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
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
            <Text variant="headlineMedium" style={styles.title}>
              Basic Info
            </Text>
            <Text
              variant="bodyLarge"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Let&apos;s start with the basics
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
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                style={styles.input}
              />

              <View style={styles.dateInputContainer}>
                <Text variant="bodyLarge" style={styles.label}>
                  Date of Birth
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                >
                  {dateOfBirth.toLocaleDateString()}
                </Button>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                />
              )}

              <View style={styles.genderContainer}>
                <Text variant="bodyLarge" style={styles.label}>
                  Gender
                </Text>
                <SegmentedButtons
                  value={gender}
                  onValueChange={setGender}
                  buttons={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </View>

              <Button
                mode="contained"
                onPress={validateAndNext}
                style={styles.button}
              >
                Next
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
    gap: 24,
  },
  input: {
    marginBottom: 8,
  },
  dateInputContainer: {
    gap: 8,
  },
  label: {
    fontWeight: "600",
  },
  dateButton: {
    justifyContent: "center",
  },
  genderContainer: {
    gap: 8,
  },
  button: {
    marginTop: 16,
  },
});
