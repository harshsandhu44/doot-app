import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Surface,
  useTheme,
  ActivityIndicator,
  Text,
  Divider,
} from "react-native-paper";
import { useLocalSearchParams, Stack } from "expo-router";
import { PhotoCarousel } from "../../components/photo-carousel";
import { InterestTag } from "../../components/interest-tag";
import { getUserProfile } from "../../services/user";
import { UserProfile } from "../../models/user";

export default function ViewProfileScreen() {
  const theme = useTheme();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Profile",
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

  if (error || !userProfile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Profile",
          }}
        />
        <Surface
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.centerContent}>
            <Text variant="headlineSmall" style={{ color: theme.colors.error }}>
              {error || "Profile not found"}
            </Text>
          </View>
        </Surface>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: userProfile.profile.name,
        }}
      />
      <Surface
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScrollView>
          {userProfile.profile.photos &&
            userProfile.profile.photos.length > 0 && (
              <PhotoCarousel photos={userProfile.profile.photos} height={400} />
            )}

          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text variant="headlineMedium" style={styles.name}>
                {userProfile.profile.name}
              </Text>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {userProfile.profile.age}
              </Text>
            </View>

            {userProfile.profile.location && (
              <Text
                variant="bodyLarge"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginBottom: 16,
                }}
              >
                {userProfile.profile.location.city}
              </Text>
            )}

            {userProfile.profile.bio && (
              <>
                <Divider style={{ marginVertical: 16 }} />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  About
                </Text>
                <Text variant="bodyLarge" style={styles.bio}>
                  {userProfile.profile.bio}
                </Text>
              </>
            )}

            {userProfile.profile.interests &&
              userProfile.profile.interests.length > 0 && (
                <>
                  <Divider style={{ marginVertical: 16 }} />
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Interests
                  </Text>
                  <View style={styles.interestsContainer}>
                    {userProfile.profile.interests.map((interest, index) => (
                      <InterestTag key={index} interest={interest} selected />
                    ))}
                  </View>
                </>
              )}

            {(userProfile.profile.education ||
              userProfile.profile.occupation ||
              userProfile.profile.height) && (
              <>
                <Divider style={{ marginVertical: 16 }} />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Details
                </Text>
                <View style={styles.detailsContainer}>
                  {userProfile.profile.occupation && (
                    <View style={styles.detailRow}>
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Occupation:
                      </Text>
                      <Text variant="bodyLarge">
                        {userProfile.profile.occupation}
                      </Text>
                    </View>
                  )}
                  {userProfile.profile.education && (
                    <View style={styles.detailRow}>
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Education:
                      </Text>
                      <Text variant="bodyLarge">
                        {userProfile.profile.education}
                      </Text>
                    </View>
                  )}
                  {userProfile.profile.height && (
                    <View style={styles.detailRow}>
                      <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Height:
                      </Text>
                      <Text variant="bodyLarge">
                        {userProfile.profile.height} cm
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>
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
    padding: 24,
  },
  content: {
    padding: 20,
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
    marginBottom: 12,
  },
  bio: {
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  detailsContainer: {
    gap: 12,
    marginTop: 8,
  },
  detailRow: {
    gap: 4,
  },
});
