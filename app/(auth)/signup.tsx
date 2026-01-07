import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Text,
  TextInput,
  Button,
  Surface,
  Divider,
  useTheme,
} from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setLocalError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setLocalError("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(email, password);
      // Navigation will be handled by RootLayoutNav based on onboarding status
    } catch (error: any) {
      setLocalError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError("");
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Navigation will be handled by RootLayoutNav based on onboarding status
    } catch (error: any) {
      setLocalError(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.back();
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
              Create Account
            </Text>
            <Text
              variant="bodyLarge"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Sign up to get started
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
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                disabled={isLoading}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                disabled={isLoading}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                disabled={isLoading}
                style={styles.input}
              />

              <Button
                mode="contained"
                onPress={handleSignup}
                disabled={isLoading}
                loading={isLoading}
                style={styles.button}
              >
                Sign Up
              </Button>

              <View style={styles.divider}>
                <Divider style={styles.dividerLine} />
                <Text variant="bodySmall" style={styles.dividerText}>
                  or
                </Text>
                <Divider style={styles.dividerLine} />
              </View>

              <Button
                mode="outlined"
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                style={styles.googleButton}
              >
                Continue with Google
              </Button>

              <View style={styles.footer}>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Already have an account?{" "}
                </Text>
                <Button
                  mode="text"
                  onPress={navigateToLogin}
                  disabled={isLoading}
                  compact
                >
                  Sign In
                </Button>
              </View>
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
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
  },
  dividerText: {
    textAlign: "center",
  },
  googleButton: {
    marginBottom: 8,
  },
});
