import React, { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PhotoCarouselProps {
  photos: string[];
  height: number;
  width?: number;
}

export function PhotoCarousel({ photos, height, width = SCREEN_WIDTH }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  if (!photos || photos.length === 0) {
    return (
      <View style={[styles.placeholder, { height, width }]}>
        <Image
          source={require('../assets/images/icon.png')}
          style={{ width: 64, height: 64, opacity: 0.2 }}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, width }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ height, width }}
      >
        {photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={{ width, height }}
            contentFit="cover"
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
                  backgroundColor: index === currentIndex ? COLORS.white : 'rgba(255, 255, 255, 0.5)',
                  flex: 1,
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
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  dotsContainer: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    gap: 4,
    height: 4,
  },
  dot: {
    height: 4,
    borderRadius: BORDER_RADIUS.full,
  },
});