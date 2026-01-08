import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Text, ActivityIndicator, Portal, Dialog } from "react-native-paper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth-context";
import { useRouter, Stack } from "expo-router";
import { InterestChip } from "../../components/interest-chip";
import { Button } from "../../components/button";
import { getUserProfile } from "../../services/user";
import { UserProfile } from "../../models/user";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm * 2) / 3;

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const loadProfile = useCallback(async () => {
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
  }, [user?.uid]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowSignOutDialog(false);
      router.replace("/(auth)/login" as any);
    } catch {
      setShowSignOutDialog(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const photos = userProfile?.profile.photos || [];
  const emptyPhotosCount = 6 - photos.length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/settings" as any)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoSection}>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: photos[0] || 'https://via.placeholder.com/150' }}
              style={styles.mainAvatar}
            />
            <TouchableOpacity style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.nameText}>
            {userProfile?.profile.name}, {userProfile?.profile.age}
          </Text>
        </View>

        <View style={styles.photoGridSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.progressText}>{photos.length} of 6 photos</Text>
          </View>
          
          <View style={styles.grid}>
            {photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.gridPhoto} />
            ))}
            {Array.from({ length: emptyPhotosCount }).map((_, index) => (
              <TouchableOpacity key={`empty-${index}`} style={styles.emptyPhotoSlot}>
                <Ionicons name="add" size={32} color={COLORS.border} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {userProfile?.profile.bio || "No bio yet. Add something about yourself!"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {userProfile?.profile.interests?.map((interest, index) => (
              <InterestChip key={index} label={interest} selected />
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Settings</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsLabel}>
              <Ionicons name="location-outline" size={24} color={COLORS.textSecondary} />
              <Text style={styles.settingsText}>Location</Text>
            </View>
            <View style={styles.settingsValue}>
              <Text style={styles.valueText}>{userProfile?.profile.location?.city || "Set location"}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsLabel}>
              <Ionicons name="options-outline" size={24} color={COLORS.textSecondary} />
              <Text style={styles.settingsText}>Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <Button
          title="Sign Out"
          onPress={() => setShowSignOutDialog(true)}
          variant="primary"
          style={styles.signOutButton}
        />
      </ScrollView>

      <Portal>
        <Dialog visible={showSignOutDialog} onDismiss={() => setShowSignOutDialog(false)}>
          <Dialog.Title>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Are you sure you want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <TouchableOpacity onPress={() => setShowSignOutDialog(false)} style={styles.dialogButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.dialogButton}>
              <Text style={styles.signOutConfirmText}>Sign Out</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  content: {
    paddingBottom: SPACING.xxl,
  },
  editButton: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "bold",
    marginRight: SPACING.md,
  },
  photoSection: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: COLORS.primary,
    position: 'relative',
  },
  mainAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  nameText: {
    ...TYPOGRAPHY.title,
    marginTop: SPACING.md,
  },
  photoGridSection: {
    paddingHorizontal: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  gridPhoto: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: BORDER_RADIUS.medium,
  },
  emptyPhotoSlot: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  bioContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.medium,
  },
  bioText: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  settingsText: {
    ...TYPOGRAPHY.body,
  },
  settingsValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  signOutButton: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.error,
  },
  dialogText: {
    ...TYPOGRAPHY.body,
  },
  dialogButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.md,
  },
  cancelText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  signOutConfirmText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
    fontWeight: 'bold',
  },
});