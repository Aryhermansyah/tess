import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, TouchableOpacityProps, ViewProps, TextProps, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { injectAnimationStyles } from './animations';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { getAnimationClass } from './animations';

// Inject CSS animations saat import
if (Platform.OS === 'web') {
  injectAnimationStyles();
}

interface AnimatedViewProps extends ViewProps {
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'zoomOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'pulse' | 'bounce' | 'float';
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface AnimatedTextProps extends TextProps {
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'shimmer' | 'pulse';
  delay?: number;
  duration?: number;
  style?: TextStyle;
  children?: React.ReactNode;
}

interface AnimatedButtonProps extends TouchableOpacityProps {
  animation?: 'fadeIn' | 'pulse' | 'bounce' | 'shake' | 'float';
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  delay?: number;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

interface AnimatedCardProps extends ViewProps {
  animation?: 'fadeIn' | 'fadeInUp' | 'zoomIn' | 'slideUp';
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
}

export interface AnimationProps {
  animation?: string; // nama animasi
  duration?: number; // durasi dalam ms
  delay?: number; // penundaan dalam ms
  iterationCount?: number | 'infinite'; // berapa kali animasi diputar
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  easing?: string; // kurva easing
  useNativeDriver?: boolean; // gunakan driver native di React Native
  intensity?: number; // intensitas animasi (1 normal, >1 lebih intens)
}

export const AnimatedView = ({ 
  children, 
  style, 
  animation, 
  duration = 500, 
  delay = 0, 
  iterationCount = 1,
  direction = 'normal',
  fillMode = 'none',
  easing = 'ease',
  intensity = 1,
  useNativeDriver = true,
  ...props 
}: AnimationProps & { children?: React.ReactNode, style?: any }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Untuk web
  if (Platform.OS === 'web') {
    const animationClass = animation ? getAnimationClass(animation) : '';
    
    return (
      <View 
        style={style} 
        {...props}
        className={animationClass}
      >
        {children}
      </View>
    );
  }
  
  // Untuk React Native
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.8);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    setTimeout(() => {
      if (animation === 'fadeIn') {
        opacity.value = withTiming(1, timingConfig);
      } else if (animation === 'fadeInUp') {
        opacity.value = withTiming(1, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      } else if (animation === 'zoomIn') {
        opacity.value = withTiming(1, timingConfig);
        scale.value = withTiming(1, timingConfig);
      } else if (animation === 'bounce') {
        translateY.value = withSequence(
          withTiming(-10 * intensity, { duration: duration * 0.4 }),
          withTiming(0, { duration: duration * 0.6 })
        );
        opacity.value = withTiming(1, { duration: duration * 0.3 });
      } else if (animation === 'pulse') {
        scale.value = withRepeat(
          withSequence(
            withTiming(1 + (0.05 * intensity), { duration: duration * 0.5 }),
            withTiming(1, { duration: duration * 0.5 })
          ),
          iterationCount === 'infinite' ? -1 : iterationCount as number
        );
        opacity.value = withTiming(1, { duration: duration * 0.3 });
      } else if (animation === 'shake') {
        const shakeTiming = { duration: duration / 6 };
        rotate.value = withSequence(
          withTiming(-5 * intensity, shakeTiming),
          withTiming(5 * intensity, shakeTiming),
          withTiming(-5 * intensity, shakeTiming),
          withTiming(5 * intensity, shakeTiming),
          withTiming(-5 * intensity, shakeTiming),
          withTiming(0, shakeTiming)
        );
        opacity.value = withTiming(1, { duration: duration * 0.3 });
      } else if (animation === 'rotate') {
        rotate.value = withRepeat(
          withTiming(360, { duration }),
          iterationCount === 'infinite' ? -1 : iterationCount as number
        );
        opacity.value = withTiming(1, { duration: duration * 0.3 });
      } else {
        // Default animation - fadeIn
        opacity.value = withTiming(1, timingConfig);
      }
    }, delay);
  }, [animation, duration, delay, iterationCount, opacity, translateY, scale, rotate, intensity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotate.value}deg` }
      ]
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

export const AnimatedText = ({ 
  children, 
  style, 
  animation, 
  duration = 500, 
  delay = 0, 
  iterationCount = 1,
  direction = 'normal',
  fillMode = 'none',
  easing = 'ease',
  intensity = 1,
  useNativeDriver = true,
  ...props 
}: AnimationProps & { children?: React.ReactNode, style?: any }) => {
  // Web
  if (Platform.OS === 'web') {
    const animationClass = animation ? getAnimationClass(animation) : '';
    
    return (
      <Text 
        style={style} 
        {...props}
        className={animationClass}
      >
        {children}
      </Text>
    );
  }
  
  // React Native
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    setTimeout(() => {
      if (animation === 'fadeIn' || !animation) {
        opacity.value = withTiming(1, timingConfig);
      } else if (animation === 'fadeInUp') {
        opacity.value = withTiming(1, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      } else if (animation === 'zoomIn') {
        opacity.value = withTiming(1, timingConfig);
        scale.value = withTiming(1, timingConfig);
      } else {
        opacity.value = withTiming(1, timingConfig);
      }
    }, delay);
  }, [animation, duration, delay, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });

  return (
    <Animated.Text style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.Text>
  );
};

export const AnimatedButton = ({ 
  children, 
  style, 
  activeOpacity = 0.8,
  animation, 
  duration = 500, 
  delay = 0, 
  iterationCount = 1,
  direction = 'normal',
  fillMode = 'none',
  easing = 'ease',
  intensity = 1,
  useNativeDriver = true,
  onPress,
  pressAnimation = 'pulse',
  ...props 
}: AnimationProps & { 
  children?: React.ReactNode, 
  style?: any, 
  activeOpacity?: number,
  onPress?: () => void,
  pressAnimation?: string
}) => {
  const [isPressing, setIsPressing] = useState(false);

  // Web
  if (Platform.OS === 'web') {
    const animationClass = animation ? getAnimationClass(animation) : '';
    const pressAnimationClass = isPressing && pressAnimation ? getAnimationClass(pressAnimation) : '';
    
    return (
      <TouchableOpacity 
        style={[buttonStyles.button, style]} 
        {...props}
        onPress={onPress}
        onPressIn={() => setIsPressing(true)}
        onPressOut={() => setIsPressing(false)}
        className={`${animationClass} ${pressAnimationClass}`}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  // React Native
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    setTimeout(() => {
      if (animation === 'fadeIn' || !animation) {
        opacity.value = withTiming(1, timingConfig);
      } else if (animation === 'fadeInUp') {
        opacity.value = withTiming(1, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      } else if (animation === 'zoomIn') {
        opacity.value = withTiming(1, timingConfig);
        scale.value = withTiming(1, timingConfig);
      } else {
        opacity.value = withTiming(1, timingConfig);
      }
    }, delay);
  }, [animation, duration, delay, opacity, translateY, scale]);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
    if (onPress) setIsPressing(true);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
    setIsPressing(false);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });

  return (
    <Animated.View style={[buttonStyles.button, style, animatedStyle]}>
      <TouchableOpacity
        style={buttonStyles.touchable}
        activeOpacity={activeOpacity}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const AnimatedCard = ({ 
  children, 
  style, 
  animation = 'fadeIn', 
  duration = 500, 
  delay = 0, 
  iterationCount = 1,
  direction = 'normal',
  fillMode = 'none',
  easing = 'ease',
  intensity = 1,
  useNativeDriver = true,
  ...props 
}: AnimationProps & { children?: React.ReactNode, style?: any }) => {
  // Web
  if (Platform.OS === 'web') {
    const animationClass = animation ? getAnimationClass(animation) : '';
    
    return (
      <View 
        style={[cardStyles.card, style]} 
        {...props}
        className={`card ${animationClass}`}
      >
        {children}
      </View>
    );
  }
  
  // React Native
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);
  
  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    };

    setTimeout(() => {
      if (animation === 'fadeIn' || !animation) {
        opacity.value = withTiming(1, timingConfig);
      } else if (animation === 'fadeInUp') {
        opacity.value = withTiming(1, timingConfig);
        translateY.value = withTiming(0, timingConfig);
      } else if (animation === 'zoomIn') {
        opacity.value = withTiming(1, timingConfig);
        scale.value = withTiming(1, timingConfig);
      } else {
        opacity.value = withTiming(1, timingConfig);
      }
    }, delay);
  }, [animation, duration, delay, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ]
    };
  });

  return (
    <Animated.View style={[cardStyles.card, style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

// Komponen baru untuk animasi loading
export const AnimatedLoader = ({ 
  style, 
  size = 40, 
  color = '#007AFF',
  type = 'spinner',
  ...props 
}: { 
  style?: any, 
  size?: number, 
  color?: string,
  type?: 'spinner' | 'pulse' | 'dots'
}) => {
  // Web
  if (Platform.OS === 'web') {
    if (type === 'spinner') {
      return (
        <View 
          style={[
            loaderStyles.container, 
            { width: size, height: size }, 
            style
          ]} 
          {...props}
          className="animate-rotate"
        >
          <View style={[loaderStyles.spinner, { borderColor: color, borderTopColor: 'transparent' }]} />
        </View>
      );
    } else if (type === 'pulse') {
      return (
        <View 
          style={[
            loaderStyles.container, 
            { width: size, height: size }, 
            style
          ]} 
          {...props}
          className="animate-pulse"
        >
          <View style={[loaderStyles.dot, { backgroundColor: color }]} />
        </View>
      );
    } else {
      return (
        <View style={[loaderStyles.dotsContainer, style]} {...props}>
          <View style={[loaderStyles.dot, { backgroundColor: color }]} className="animate-pulse" />
          <View style={[loaderStyles.dot, { backgroundColor: color, animationDelay: '0.2s' }]} className="animate-pulse" />
          <View style={[loaderStyles.dot, { backgroundColor: color, animationDelay: '0.4s' }]} className="animate-pulse" />
        </View>
      );
    }
  }
  
  // React Native
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
    
    if (type === 'pulse') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1
      );
    }
  }, [rotation, scale, type]);

  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }]
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  if (type === 'spinner') {
    return (
      <View style={[loaderStyles.container, { width: size, height: size }, style]} {...props}>
        <Animated.View 
          style={[
            loaderStyles.spinner, 
            { borderColor: color, borderTopColor: 'transparent' }, 
            spinnerStyle
          ]} 
        />
      </View>
    );
  } else if (type === 'pulse') {
    return (
      <View style={[loaderStyles.container, { width: size, height: size }, style]} {...props}>
        <Animated.View 
          style={[
            loaderStyles.dot, 
            { backgroundColor: color }, 
            pulseStyle
          ]} 
        />
      </View>
    );
  } else {
    return (
      <View style={[loaderStyles.dotsContainer, style]} {...props}>
        <Animated.View style={[loaderStyles.dot, { backgroundColor: color }]}>
          <AnimatedView animation="pulse" iterationCount="infinite" duration={800} delay={0} />
        </Animated.View>
        <Animated.View style={[loaderStyles.dot, { backgroundColor: color }]}>
          <AnimatedView animation="pulse" iterationCount="infinite" duration={800} delay={200} />
        </Animated.View>
        <Animated.View style={[loaderStyles.dot, { backgroundColor: color }]}>
          <AnimatedView animation="pulse" iterationCount="infinite" duration={800} delay={400} />
        </Animated.View>
      </View>
    );
  }
};

// == Styles ==
const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  }
});

const loaderStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 20,
  }
});

// Modal animasi
export const AnimatedModal = ({ 
  children, 
  visible, 
  onClose, 
  animation = 'fadeIn', 
  duration = 300, 
  contentStyle,
  backdropStyle,
  ...props 
}: {
  children?: React.ReactNode, 
  visible: boolean, 
  onClose: () => void, 
  animation?: string, 
  duration?: number,
  contentStyle?: any,
  backdropStyle?: any
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  
  useEffect(() => {
    if (visible) {
      setModalVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setModalVisible(false);
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [visible, duration]);
  
  // Web
  if (Platform.OS === 'web') {
    if (!modalVisible) return null;
    
    let animationIn = animation;
    let animationOut = animation === 'fadeIn' ? 'fadeOut' : 
                       animation === 'zoomIn' ? 'zoomOut' : 
                       animation === 'slideUp' ? 'slideDown' : 'fadeOut';
    
    const modalClasses = visible ? getAnimationClass(animationIn) : getAnimationClass(animationOut);
    
    return (
      <View 
        style={[modalStyles.backdrop, backdropStyle]}
        onClick={onClose}
        className={visible ? 'animate-fade-in' : 'animate-fade-out'}
      >
        <View 
          style={[modalStyles.content, contentStyle]} 
          onClick={(e) => e.stopPropagation()} 
          className={modalClasses}
          {...props}
        >
          {children}
        </View>
      </View>
    );
  }
  
  // React Native
  if (!modalVisible) return null;
  
  const opacity = useSharedValue(visible ? 0 : 1);
  const scale = useSharedValue(visible ? 0.8 : 1);
  const translateY = useSharedValue(visible ? 50 : 0);
  
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration });
      if (animation === 'zoomIn') {
        scale.value = withTiming(1, { duration });
      } else if (animation === 'slideUp') {
        translateY.value = withTiming(0, { duration });
      }
    } else {
      opacity.value = withTiming(0, { duration });
      if (animation === 'zoomIn') {
        scale.value = withTiming(0.8, { duration });
      } else if (animation === 'slideUp') {
        translateY.value = withTiming(50, { duration });
      }
    }
  }, [visible, animation, duration, opacity, scale, translateY]);
  
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  
  const contentStyle = useAnimatedStyle(() => {
    if (animation === 'zoomIn') {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    } else if (animation === 'slideUp') {
      return {
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
      };
    }
    return {
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View style={[modalStyles.backdrop, backdropStyle]} {...props}>
      <TouchableOpacity 
        style={modalStyles.backdropTouch} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <Animated.View style={[modalStyles.content, contentStyle]}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdropTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  }
}); 