import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { PhotoCarousel } from "../../components/photo-carousel";
import { InterestChip } from "../../components/interest-chip";
import { Button } from "../../components/button";
import { getUserProfile } from "../../services/user";
import { UserProfile } from "../../models/user";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ViewProfileScreen() {
  const router = useRouter();
  const { userId, fromMatch } = useLocalSearchParams<{ userId: string, fromMatch?: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
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
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !userProfile) {
    return (
      <View style={styles.centerContent}>
        <Text style={{ color: COLORS.error }}>{error || "Profile not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: userProfile.profile.name,
          headerTransparent: true,
          headerTintColor: COLORS.white,
          headerBackground: () => null,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PhotoCarousel 
          photos={userProfile.profile.photos || []} 
          height={SCREEN_HEIGHT * 0.6} 
        />

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{userProfile.profile.name}, {userProfile.profile.age}</Text>
            {userProfile.profile.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color={COLORS.textSecondary} />
                <Text style={styles.locationText}>{userProfile.profile.location.city}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{userProfile.profile.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {userProfile.profile.interests?.map((interest, index) => (
                <InterestChip key={index} label={interest} selected />
              ))}
            </View>
          </View>

          {(userProfile.profile.occupation || userProfile.profile.education || userProfile.profile.height) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailsGrid}>
                {userProfile.profile.occupation && (
                  <View style={styles.detailItem}>
                    <Ionicons name="briefcase-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.detailText}>{userProfile.profile.occupation}</Text>
                  </View>
                )}
                {userProfile.profile.education && (
                  <View style={styles.detailItem}>
                    <Ionicons name="school-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.detailText}>{userProfile.profile.education}</Text>
                  </View>
                )}
                {userProfile.profile.height && (
                  <View style={styles.detailItem}>
                    <Ionicons name="resize-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.detailText}>{userProfile.profile.height} cm</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {fromMatch ? (
          <Button 
            title="Send Message" 
            onPress={() => router.back()} // In a real app, navigate to chat
            variant="primary" 
            style={styles.fullButton}
          />
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.passButton]}>
              <Ionicons name="close" size={32} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
              <Ionicons name="heart" size={32} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    padding: SPACING.lg,
    marginTop: -SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
  },
  headerInfo: {
    gap: 4,
  },
  name: {
    ...TYPOGRAPHY.title,
    fontSize: 28,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  bioText: {
    ...TYPOGRAPHY.body,
    lineHeight: 24,
    color: COLORS.text,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  detailsGrid: {
    gap: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    ...TYPOGRAPHY.body,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'transparent',
  },
  fullButton: {
    width: '100%',
    ...SHADOWS.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  passButton: {},
  likeButton: {},
});