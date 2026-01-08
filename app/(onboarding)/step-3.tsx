import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import * as Location from "expo-location";
import { Button } from "../../components/button";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function Step3() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [location, setLocation] = useState(data.location || { city: "", coordinates: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestLocation = async () => {
    setLoading(true);
    setError("");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission is required to continue");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

      const city = address.city || address.subregion || address.region || "Unknown";
      setLocation({ city, coordinates: { latitude, longitude } });
    } catch (err: any) {
      console.error("Location error:", err);
      setError("Failed to get location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateAndNext = () => {
    if (!location.coordinates) return setError("Please allow location access to continue");
    updateData({ location });
    router.push("/(onboarding)/step-4");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Where are you?</Text>
        <Text style={styles.subtitle}>Find people nearby by sharing your location</Text>

        <View style={styles.centerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={48} color={COLORS.primary} />
          </View>
          
          {location.coordinates ? (
            <View style={styles.locationCard}>
              <Text style={styles.locationTitle}>Location detected</Text>
              <Text style={styles.cityName}>{location.city}</Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>
              We need your location to show you the most relevant profiles nearby.
            </Text>
          )}

          <Button
            title={location.coordinates ? "Update Location" : "Enable Location"}
            onPress={requestLocation}
            loading={loading}
            variant="ghost"
            style={styles.locationButton}
          />
        </View>

        <View style={styles.tipContainer}>
          <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
          <Text style={styles.tipText}>
            Your exact location is never shown to other users.
          </Text>
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={validateAndNext}
          disabled={!location.coordinates || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 28,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  centerSection: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationCard: {
    alignItems: 'center',
    gap: 4,
  },
  locationTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  cityName: {
    ...TYPOGRAPHY.heading,
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.xl,
  },
  locationButton: {
    width: '100%',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginTop: SPACING.xxl,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    flex: 1,
  },
  errorText: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: COLORS.background,
  },
});