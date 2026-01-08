import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Surface,
  useTheme,
  Text,
  List,
  Divider,
  ActivityIndicator,
  IconButton,
  Dialog,
  Portal,
  Button,
} from "react-native-paper";
import { useAuth } from "../contexts/auth-context";
import { useRouter, Stack } from "expo-router";
import { getUserProfile, updatePreferences } from "../services/user";
import { UserProfile } from "../models/user";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileIncomplete, setProfileIncomplete] = useState(false);

  // Preferences state
  const [lookingFor, setLookingFor] = useState<"male" | "female" | "everyone">(
    "everyone",
  );
  const [ageRange, setAgeRange] = useState({ min: 18, max: 100 });
  const [distance, setDistance] = useState(50);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
        setLookingFor(profile.preferences.lookingFor);
        setAgeRange(profile.preferences.ageRange);
        setDistance(profile.preferences.distanceRadius);
        setProfileIncomplete(false);
      } else {
        setProfileIncomplete(true);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setProfileIncomplete(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user?.uid) return;

    try {
      await updatePreferences(user.uid, {
        lookingFor,
        ageRange,
        distanceRadius: distance,
      });
      setShowPreferencesDialog(false);
      loadProfile();
    } catch (err: any) {
      console.error("Error updating preferences:", err);
      setShowPreferencesDialog(false);
      setErrorMessage(
        err.message || "Failed to update preferences. Please complete your profile first."
      );
      setShowErrorDialog(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogoutDialog(false);
      router.replace("/(auth)/login" as any);
    } catch (err) {
      console.error("Error signing out:", err);
      setShowLogoutDialog(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Settings",
            headerLeft: () => (
              <IconButton icon="arrow-left" onPress={() => router.back()} />
            ),
          }}
        />
        <Surface
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
          </View>
        </Surface>
      </>
    );
  }

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: "Settings",
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }}
      />
      <ScrollView>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Email"
            description={user?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Divider />
        </List.Section>

        <List.Section>
          <List.Subheader>Discovery Preferences</List.Subheader>
          {profileIncomplete && (
            <View style={{ padding: 16, backgroundColor: theme.colors.errorContainer, marginHorizontal: 16, borderRadius: 8, marginBottom: 8 }}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                Complete your profile to edit preferences
              </Text>
            </View>
          )}
          <List.Item
            title="Gender Preference"
            description={
              profileIncomplete
                ? "Complete profile first"
                : lookingFor === "everyone"
                  ? "Everyone"
                  : lookingFor === "male"
                    ? "Men"
                    : "Women"
            }
            left={(props) => <List.Icon {...props} icon="gender-male-female" />}
            onPress={() => {
              if (profileIncomplete) {
                setErrorMessage("Please complete your profile before editing preferences.");
                setShowErrorDialog(true);
              } else {
                setShowPreferencesDialog(true);
              }
            }}
            disabled={profileIncomplete}
          />
          <List.Item
            title="Age Range"
            description={
              profileIncomplete
                ? "Complete profile first"
                : `${ageRange.min} - ${ageRange.max} years`
            }
            left={(props) => <List.Icon {...props} icon="account-clock" />}
            onPress={() => {
              if (profileIncomplete) {
                setErrorMessage("Please complete your profile before editing preferences.");
                setShowErrorDialog(true);
              } else {
                setShowPreferencesDialog(true);
              }
            }}
            disabled={profileIncomplete}
          />
          <List.Item
            title="Distance"
            description={
              profileIncomplete
                ? "Complete profile first"
                : `Up to ${distance} km`
            }
            left={(props) => <List.Icon {...props} icon="map-marker-radius" />}
            onPress={() => {
              if (profileIncomplete) {
                setErrorMessage("Please complete your profile before editing preferences.");
                setShowErrorDialog(true);
              } else {
                setShowPreferencesDialog(true);
              }
            }}
            disabled={profileIncomplete}
          />
          <Divider />
        </List.Section>

        <List.Section>
          <List.Subheader>Privacy</List.Subheader>
          <List.Item
            title="Block List"
            description="Manage blocked users"
            left={(props) => <List.Icon {...props} icon="account-cancel" />}
            onPress={() => {}}
          />
          <Divider />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-lock" />}
            onPress={() => {}}
          />
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
        </List.Section>

        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={() => setShowLogoutDialog(true)}
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.onErrorContainer}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}
        >
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor={theme.colors.error}>
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={showPreferencesDialog}
          onDismiss={() => setShowPreferencesDialog(false)}
        >
          <Dialog.Title>Discovery Preferences</Dialog.Title>
          <Dialog.Content>
            <Text variant="labelLarge" style={{ marginBottom: 8 }}>
              Show me
            </Text>
            <View style={styles.radioGroup}>
              <Button
                mode={lookingFor === "everyone" ? "contained" : "outlined"}
                onPress={() => setLookingFor("everyone")}
                style={styles.radioButton}
              >
                Everyone
              </Button>
              <Button
                mode={lookingFor === "male" ? "contained" : "outlined"}
                onPress={() => setLookingFor("male")}
                style={styles.radioButton}
              >
                Men
              </Button>
              <Button
                mode={lookingFor === "female" ? "contained" : "outlined"}
                onPress={() => setLookingFor("female")}
                style={styles.radioButton}
              >
                Women
              </Button>
            </View>

            <Text
              variant="labelLarge"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              Age range: {ageRange.min} - {ageRange.max}
            </Text>
            <View style={styles.sliderContainer}>
              <Text variant="bodySmall">Min: {ageRange.min}</Text>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={100}
                step={1}
                value={ageRange.min}
                onValueChange={(value) =>
                  setAgeRange({ ...ageRange, min: value })
                }
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.surfaceVariant}
              />
            </View>
            <View style={styles.sliderContainer}>
              <Text variant="bodySmall">Max: {ageRange.max}</Text>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={100}
                step={1}
                value={ageRange.max}
                onValueChange={(value) =>
                  setAgeRange({ ...ageRange, max: value })
                }
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.surfaceVariant}
              />
            </View>

            <Text
              variant="labelLarge"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              Distance: {distance} km
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={200}
              step={1}
              value={distance}
              onValueChange={setDistance}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.surfaceVariant}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPreferencesDialog(false)}>
              Cancel
            </Button>
            <Button onPress={handleSavePreferences}>Save</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={showErrorDialog} onDismiss={() => setShowErrorDialog(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{errorMessage}</Text>
            {profileIncomplete && (
              <Text variant="bodySmall" style={{ marginTop: 12, color: theme.colors.onSurfaceVariant }}>
                It looks like you haven't completed your profile yet. Please complete the onboarding to use all features.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowErrorDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutContainer: {
    padding: 24,
  },
  logoutButton: {
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  radioButton: {
    flex: 1,
    minWidth: 100,
  },
  sliderContainer: {
    marginVertical: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
