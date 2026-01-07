import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Surface, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import * as Location from "expo-location";

export default function Step3() {
  const router = useRouter();
  const theme = useTheme();
  const { data, updateData } = useOnboarding();

  const [location, setLocation] = useState(data.location);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestLocation = async () => {
    setLoading(true);
    setError("");

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission is required to continue");
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get city name
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const city =
        address.city || address.subregion || address.region || "Unknown";

      setLocation({
        city,
        coordinates: { latitude, longitude },
      });
    } catch (err: any) {
      console.error("Location error:", err);
      setError("Failed to get location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateAndNext = () => {
    setError("");

    if (!location.coordinates) {
      setError("Please allow location access to continue");
      return;
    }

    // Save data and navigate
    updateData({ location });
    router.push("/(onboarding)/step-4");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <Surface
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Your Location
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            We need your location to show you people nearby
          </Text>

          {error ? (
            <Surface
              style={[
                styles.errorContainer,
                { backgroundColor: theme.colors.errorContainer },
              ]}
            >
              <Text style={{ color: theme.colors.onErrorContainer }}>
                {error}
              </Text>
            </Surface>
          ) : null}

          {location.coordinates ? (
            <Surface
              style={[
                styles.locationCard,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Text variant="titleMedium" style={styles.locationTitle}>
                Location Detected
              </Text>
              <Text variant="bodyLarge" style={styles.cityName}>
                {location.city}
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.coordinates,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {location.coordinates.latitude.toFixed(4)},{" "}
                {location.coordinates.longitude.toFixed(4)}
              </Text>
            </Surface>
          ) : (
            <View style={styles.emptyState}>
              <Text
                variant="bodyMedium"
                style={[
                  styles.emptyText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Tap the button below to allow location access
              </Text>
            </View>
          )}

          <Button
            mode="contained"
            onPress={requestLocation}
            loading={loading}
            disabled={loading}
            style={styles.locationButton}
            icon="map-marker"
          >
            {location.coordinates ? "Update Location" : "Enable Location"}
          </Button>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              mode="contained"
              onPress={validateAndNext}
              style={styles.nextButton}
              disabled={!location.coordinates || loading}
            >
              Next
            </Button>
          </View>
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    marginBottom: 32,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  locationTitle: {
    marginBottom: 8,
  },
  cityName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    textAlign: "center",
  },
  locationButton: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
