import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Button,
  Surface,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useOnboarding } from "../../contexts/onboarding-context";
import * as ImagePicker from "expo-image-picker";

export default function Step2() {
  const router = useRouter();
  const theme = useTheme();
  const { data, updateData } = useOnboarding();

  const [photos, setPhotos] = useState<string[]>(data.photos);
  const [error, setError] = useState("");

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert("Maximum reached", "You can only upload up to 6 photos");
      return;
    }

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant photo library access to upload images"
      );
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as any,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
      setError("");
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const validateAndNext = () => {
    setError("");

    // Save data and navigate
    updateData({ photos });
    router.push("/(onboarding)/step-3");
  };

  const handleSkip = () => {
    setError("");
    // Skip with empty photos array
    updateData({ photos: [] });
    router.push("/(onboarding)/step-3");
  };

  const goBack = () => {
    router.back();
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Add Your Photos
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Upload photos to showcase yourself (optional)
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

          <View style={styles.photosGrid}>
            {photos.map((uri, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri }} style={styles.photo} />
                <IconButton
                  icon="close-circle"
                  size={24}
                  style={styles.removeButton}
                  iconColor={theme.colors.error}
                  onPress={() => removePhoto(index)}
                />
              </View>
            ))}

            {photos.length < 6 && (
              <TouchableOpacity
                style={[
                  styles.addPhotoButton,
                  { borderColor: theme.colors.outline },
                ]}
                onPress={pickImage}
              >
                <IconButton icon="plus" size={32} />
                <Text variant="bodySmall">Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text
            variant="bodySmall"
            style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}
          >
            {photos.length} of 6 photos (optional - you can add photos later)
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={goBack}
              style={styles.backButton}
            >
              Back
            </Button>
            <Button
              mode="outlined"
              onPress={handleSkip}
              style={styles.skipButton}
            >
              Skip
            </Button>
            <Button
              mode="contained"
              onPress={validateAndNext}
              style={styles.nextButton}
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
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  photoContainer: {
    position: "relative",
    width: 100,
    height: 130,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 130,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: "auto",
  },
  backButton: {
    flex: 1,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});
