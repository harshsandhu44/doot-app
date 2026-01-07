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

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false);

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
      }
    } catch (err) {
      console.error("Error loading profile:", err);
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
    } catch (err) {
      console.error("Error updating preferences:", err);
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
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
            <List.Item
              title="Gender Preference"
              description={
                lookingFor === "everyone"
                  ? "Everyone"
                  : lookingFor === "male"
                    ? "Men"
                    : "Women"
              }
              left={(props) => (
                <List.Icon {...props} icon="gender-male-female" />
              )}
              onPress={() => setShowPreferencesDialog(true)}
            />
            <List.Item
              title="Age Range"
              description={`${ageRange.min} - ${ageRange.max} years`}
              left={(props) => <List.Icon {...props} icon="account-clock" />}
              onPress={() => setShowPreferencesDialog(true)}
            />
            <List.Item
              title="Distance"
              description={`Up to ${distance} km`}
              left={(props) => (
                <List.Icon {...props} icon="map-marker-radius" />
              )}
              onPress={() => setShowPreferencesDialog(true)}
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
        </Portal>
      </Surface>
    </>
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
