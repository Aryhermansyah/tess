import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { ImageWithFallback } from './ImageWithFallback';

interface AnimatedLeafProps {
  imageUrl: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  size?: number;
  delay?: number;
  fallbackImageUrl?: string;
}

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export const AnimatedLeaf: React.FC<AnimatedLeafProps> = ({
  imageUrl,
  position,
  size = isSmallScreen ? 120 : 180,
  delay = 0,
  fallbackImageUrl,
}) => {
  // Skip animations on web to avoid potential issues
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, getPositionStyle(position, size)]}>
        <ImageWithFallback
          source={imageUrl}
          style={[styles.image, { width: size, height: size }]}
          fallbackImageUrl={fallbackImageUrl}
          fallbackType="decoration"
        />
      </View>
    );
  }

  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      delay,
      useNativeDriver: true,
    }).start();

    // Start floating animation
    const startFloatingAnimation = () => {
      Animated.parallel([
        // Gentle up and down movement
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: 5,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -5,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
        // Subtle rotation
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotate, {
              toValue: 0.02, // Small rotation value (radians)
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(rotate, {
              toValue: -0.02,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    };

    // Start animation after delay
    setTimeout(startFloatingAnimation, delay);

    return () => {
      // Cleanup animations
      translateY.stopAnimation();
      rotate.stopAnimation();
      opacity.stopAnimation();
    };
  }, [translateY, rotate, opacity, delay]);

  const animatedStyle = {
    transform: [
      { translateY },
      {
        rotate: rotate.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-0.1rad', '0.1rad'],
        }),
      },
    ],
    opacity,
  };

  return (
    <Animated.View style={[styles.container, getPositionStyle(position, size), animatedStyle]}>
      <ImageWithFallback
        source={imageUrl}
        style={[styles.image, { width: size, height: size }]}
        fallbackImageUrl={fallbackImageUrl}
        fallbackType="decoration"
      />
    </Animated.View>
  );
};

const getPositionStyle = (position: string, size: number) => {
  switch (position) {
    case 'topLeft':
      return {
        top: 0,
        left: 0,
      };
    case 'topRight':
      return {
        top: 0,
        right: 0,
      };
    case 'bottomLeft':
      return {
        bottom: 0,
        left: 0,
      };
    case 'bottomRight':
      return {
        bottom: 0,
        right: 0,
      };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  image: {
    resizeMode: 'contain',
  },
});