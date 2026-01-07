import React, { useState } from "react";
import { View, ScrollView, Image, Dimensions, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PhotoCarouselProps {
  photos: string[];
  height?: number;
}

export function PhotoCarousel({ photos, height = 500 }: PhotoCarouselProps) {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  if (!photos || photos.length === 0) {
    return (
      <View
        style={[
          styles.placeholder,
          { height, backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          No photos available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ height }}
      >
        {photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={[styles.photo, { width: SCREEN_WIDTH, height }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {photos.length > 1 && (
        <View style={styles.dotsContainer}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  photo: {
    width: SCREEN_WIDTH,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
