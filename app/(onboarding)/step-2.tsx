import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../../components/button";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_SPACING = SPACING.md;
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.lg * 2 - GRID_SPACING) / 2;

export default function Step2() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();

  const [photos, setPhotos] = useState<string[]>(data.photos || []);

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert("Maximum reached", "You can only upload up to 6 photos");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant photo library access to upload images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const validateAndNext = () => {
    updateData({ photos });
    router.push("/(onboarding)/step-3");
  };

  const emptySlots = 6 - photos.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add your best photos</Text>
        <Text style={styles.subtitle}>Upload at least 2 photos to stand out</Text>

        <View style={styles.grid}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
              >
                <Ionicons name="close-circle" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}

          {Array.from({ length: emptySlots }).map((_, index) => (
            <TouchableOpacity
              key={`empty-${index}`}
              style={styles.addPhotoButton}
              onPress={pickImage}
            >
              <Ionicons name="add" size={32} color={COLORS.border} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={20} color={COLORS.secondary} />
          <Text style={styles.tipText}>
            Photos with good lighting and clear view of your face get more matches!
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={validateAndNext}
          disabled={photos.length < 1}
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_SPACING,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.3,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  tipText: {
    ...TYPOGRAPHY.caption,
    flex: 1,
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