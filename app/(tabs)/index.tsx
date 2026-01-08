import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../contexts/auth-context";
import { ProfileCard } from "../../components/profile-card";
import { EmptyState } from "../../components/empty-state";
import { fetchProfiles, recordSwipe } from "../../services/swipe";
import { UserProfile } from "../../models/user";
import * as Haptics from "expo-haptics";
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function SwipeScreen() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<(UserProfile & { distance: number })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const loadProfiles = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const fetchedProfiles = await fetchProfiles(user.uid, 10);
      setProfiles(fetchedProfiles);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error loading profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const onSwipeComplete = useCallback(async (action: "like" | "pass" | "superlike") => {
    if (!user?.uid || currentIndex >= profiles.length) return;

    const currentProfile = profiles[currentIndex];
    try {
      const result = await recordSwipe(user.uid, currentProfile.uid, action);
      if (result.matched) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error("Error recording swipe:", err);
    }

    translateX.value = 0;
    translateY.value = 0;
    setCurrentIndex(prev => prev + 1);

    if (currentIndex >= profiles.length - 3) {
      // Preload more logic could be here
    }
  }, [currentIndex, profiles, user?.uid, translateX, translateY]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const action = event.translationX > 0 ? "like" : "pass";
        translateX.value = withSpring(event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeComplete)(action);
      } else if (event.translationY < -SWIPE_THRESHOLD) {
        translateY.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeComplete)("superlike");
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const handleAction = (action: "like" | "pass" | "superlike") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action === "like") {
      translateX.value = withSpring(SCREEN_WIDTH * 1.5);
    } else if (action === "pass") {
      translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
    } else {
      translateY.value = withSpring(-SCREEN_WIDTH * 1.5);
    }
    onSwipeComplete(action);
  };

  if (loading && profiles.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="heart-outline"
          title="No more profiles nearby"
          description="Check back later for more people!"
        />
        <TouchableOpacity style={styles.reloadButton} onPress={loadProfiles}>
          <Text style={styles.reloadText}>Reload Profiles</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.cardWrapper}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.cardContainer, animatedStyle]}>
              <ProfileCard profile={profiles[currentIndex]} />
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.passButton]} 
            onPress={() => handleAction("pass")}
          >
            <Ionicons name="close" size={32} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.superLikeButton]} 
            onPress={() => handleAction("superlike")}
          >
            <Ionicons name="star" size={28} color="#3498db" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]} 
            onPress={() => handleAction("like")}
          >
            <Ionicons name="heart" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xl,
  },
  cardContainer: {
    width: SCREEN_WIDTH - SPACING.md * 2,
    zIndex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.xl,
    paddingBottom: SPACING.xxl,
    width: "100%",
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  passButton: {},
  superLikeButton: {
    width: 48,
    height: 48,
  },
  likeButton: {},
  reloadButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  reloadText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});