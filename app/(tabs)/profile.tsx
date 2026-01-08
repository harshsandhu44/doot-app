import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  Surface,
  Button,
  Card,
  useTheme,
  Dialog,
  Portal,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { InterestTag } from "../../components/interest-tag";
import { getUserProfile } from "../../services/user";
import { UserProfile } from "../../models/user";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      hideDialog();
      router.replace("/(auth)/login" as any);
    } catch {
      hideDialog();
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  if (loading) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
        </View>
      </Surface>
    );
  }

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Profile
        </Text>
        <IconButton icon="cog" onPress={handleSettings} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {userProfile?.profile.photos &&
          userProfile.profile.photos.length > 0 && (
            <View style={styles.photosContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {userProfile.profile.photos.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.nameRow}>
              <Text variant="headlineSmall" style={styles.name}>
                {userProfile?.profile.name || user?.displayName || "User"}
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {userProfile?.profile.age}
              </Text>
            </View>

            {userProfile?.profile.location && (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {userProfile.profile.location.city}
              </Text>
            )}
          </Card.Content>
        </Card>

        {userProfile?.profile.bio && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                About Me
              </Text>
              <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                {userProfile.profile.bio}
              </Text>
            </Card.Content>
          </Card>
        )}

        {userProfile?.profile.interests &&
          userProfile.profile.interests.length > 0 && (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Interests
                </Text>
                <View style={styles.interestsContainer}>
                  {userProfile.profile.interests.map((interest, index) => (
                    <InterestTag key={index} interest={interest} selected />
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Account Info
            </Text>
            <View style={styles.infoRow}>
              <Text
                variant="labelMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Email:
              </Text>
              <Text variant="bodyMedium">{user?.email}</Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={showDialog}
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.onErrorContainer}
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleSignOut} textColor={theme.colors.error}>
              Sign Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Surface>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: "600",
  },
  photosContainer: {
    marginBottom: 16,
  },
  photo: {
    width: 120,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
  },
  card: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  name: {
    fontWeight: "600",
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  infoRow: {
    marginTop: 8,
    gap: 4,
  },
  signOutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});
