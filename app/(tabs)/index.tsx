import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { Text, Surface, useTheme, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { ProfileCard } from "../../components/profile-card";
import { fetchProfiles, recordSwipe } from "../../services/swipe";
import { UserProfile } from "../../models/user";
import * as Haptics from "expo-haptics";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SwipeScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [profiles, setProfiles] = useState<
    (UserProfile & { distance: number })[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedProfiles = await fetchProfiles(user.uid, 10);
      setProfiles(fetchedProfiles);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error loading profiles:", err);
      setError("Failed to load profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: "like" | "pass" | "superlike") => {
    if (!user?.uid || currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await recordSwipe(user.uid, currentProfile.uid, action);

      if (result.matched) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        // Show match animation (could be implemented later)
        console.log("It's a match!");
      }

      // Move to next profile
      setCurrentIndex(currentIndex + 1);

      // Preload more profiles when running low
      if (currentIndex >= profiles.length - 3) {
        loadProfiles();
      }
    } catch (err) {
      console.error("Error recording swipe:", err);
      setError("Failed to record swipe. Please try again.");
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text
            variant="bodyLarge"
            style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}
          >
            Finding profiles for you...
          </Text>
        </View>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.error, marginBottom: 16 }}
          >
            {error}
          </Text>
        </View>
      </Surface>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.centerContent}>
          <Text
            variant="headlineSmall"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            No more profiles nearby
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            Check back later for more!
          </Text>
        </View>
      </Surface>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.cardContainer}>
        <ProfileCard
          profile={currentProfile}
          onLike={() => handleSwipe("like")}
          onPass={() => handleSwipe("pass")}
          onSuperLike={() => handleSwipe("superlike")}
        />
      </View>
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
    padding: 24,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
});
