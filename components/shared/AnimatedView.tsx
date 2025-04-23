import React, { useRef, useEffect, useState } from 'react';
import { Animated, ViewProps, StyleProp, ViewStyle, Platform, Easing } from 'react-native';

interface AnimatedViewProps extends ViewProps {
  animation: 
    | 'fadeIn' 
    | 'fadeOut' 
    | 'slideUp' 
    | 'slideLeft' 
    | 'slideRight' 
    | 'slideDown'
    | 'scale' 
    | 'float' 
    | 'pulse' 
    | 'bounce'
    | 'flip'
    | 'rotate'
    | 'zoom'
    | 'attention'
    | 'parallax';
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  triggerOnScroll?: boolean;
  intensity?: number;
  infinite?: boolean;
  parallaxSpeed?: number;
  parallaxDirection?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  animation,
  duration = 500,
  delay = 0,
  style,
  children,
  triggerOnScroll = true,
  intensity = 5,
  infinite = false,
  parallaxSpeed = 3,
  parallaxDirection = 'up',
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  
  // Normalisasi intensitas (1-10 -> nilai yang lebih berguna)
  const normalizedIntensity = Math.min(Math.max(intensity, 1), 10) / 10;
  
  // Untuk platform web, gunakan ref untuk mendapatkan elemen DOM
  const viewRef = useRef<any>(null);

  // CSS untuk animasi khusus
  const getAnimationKeyframes = () => {
    switch(animation) {
      case 'pulse':
        return `
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(${1 + (normalizedIntensity * 0.3)}); }
            100% { transform: scale(1); }
          }
        `;
      case 'float':
        return `
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-${10 * normalizedIntensity}px); }
            100% { transform: translateY(0); }
          }
        `;
      case 'bounce':
        return `
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-${20 * normalizedIntensity}px); }
          }
        `;
      case 'attention':
        return `
          @keyframes attention {
            0% { transform: translateX(0); }
            25% { transform: translateX(-${8 * normalizedIntensity}px); }
            50% { transform: translateX(${8 * normalizedIntensity}px); }
            75% { transform: translateX(-${8 * normalizedIntensity}px); }
            100% { transform: translateX(0); }
          }
        `;
      default:
        return '';
    }
  };

  // Terapkan gaya awal untuk animasi
  const getInitialStyle = () => {
    switch(animation) {
      case 'fadeIn':
        return { opacity: 0 };
      case 'fadeOut':
        return { opacity: 1 };
      case 'slideUp':
        return { opacity: 0, transform: `translateY(${50 * normalizedIntensity}px)` };
      case 'slideDown':
        return { opacity: 0, transform: `translateY(-${50 * normalizedIntensity}px)` };
      case 'slideLeft':
        return { opacity: 0, transform: `translateX(${50 * normalizedIntensity}px)` };
      case 'slideRight':
        return { opacity: 0, transform: `translateX(${100 * normalizedIntensity}px)` };
      case 'scale':
        return { opacity: 0, transform: 'scale(0.8)' };
      case 'zoom':
        return { opacity: 0, transform: 'scale(0)' };
      case 'flip':
        return { opacity: 0, transform: 'perspective(400px) rotateX(90deg)' };
      case 'rotate':
        return { opacity: 0, transform: 'rotate(-360deg)' };
      case 'parallax':
        return { opacity: 1 };
      default:
        return { opacity: 0 };
    }
  };

  // Terapkan gaya final untuk animasi
  const getFinalStyle = () => {
    switch(animation) {
      case 'fadeIn':
        return { opacity: 1, transform: 'none' };
      case 'fadeOut':
        return { opacity: 0, transform: 'none' };
      case 'slideUp':
      case 'slideDown':
      case 'slideLeft':
      case 'slideRight':
      case 'scale':
      case 'zoom':
      case 'flip':
      case 'rotate':
        return { opacity: 1, transform: 'none' };
      case 'parallax':
        return { opacity: 1 }; // Parallax dikelola secara terpisah oleh event scroll
      default:
        return { opacity: 1, transform: 'none' };
    }
  };

  // Fungsi untuk menerapkan animasi
  const applyAnimation = (element) => {
    if (!element) return;

    // Reset semua style
    element.style.animation = '';
    element.style.transition = '';
    element.style.transform = '';
    element.style.opacity = '';

    console.log(`Applying animation: ${animation}`);
    
    // Untuk animasi yang menggunakan keyframes
    if (['pulse', 'float', 'bounce', 'attention'].includes(animation)) {
      element.style.opacity = '1';
      element.style.animation = `${animation} ${duration}ms ease-in-out ${delay}ms ${infinite ? 'infinite' : '1'}`;
      return;
    }
    
    // Untuk parallax
    if (animation === 'parallax') {
      element.style.opacity = '1';
      setupParallax(element);
      return;
    }
    
    // Untuk animasi transisi dasar
    const initialStyle = getInitialStyle();
    const finalStyle = getFinalStyle();
    
    // Terapkan gaya awal
    Object.entries(initialStyle).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
    
    // Atur transisi
    element.style.transition = `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`;
    
    // Terapkan gaya akhir setelah delay kecil
    setTimeout(() => {
      Object.entries(finalStyle).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
    }, 50);
  };

  // Setup parallax scroll effect
  const setupParallax = (element) => {
    if (!element) return;
    
    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Cek apakah elemen terlihat di viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Hitung progress scroll (0-1)
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
        
        // Hitung perpindahan berdasarkan arah
        const shift = 50 * parallaxSpeed * normalizedIntensity * (clampedProgress - 0.5);
        
        let transform = '';
        switch (parallaxDirection) {
          case 'up':
            transform = `translateY(${-shift}px)`;
            break;
          case 'down':
            transform = `translateY(${shift}px)`;
            break;
          case 'left':
            transform = `translateX(${-shift}px)`;
            break;
          case 'right':
            transform = `translateX(${shift}px)`;
            break;
        }
        
        element.style.transform = transform;
        element.style.transition = 'transform 0.1s ease-out';
      }
    };
    
    // Tambahkan event listener
    window.addEventListener('scroll', handleScroll);
    
    // Panggil sekali untuk posisi awal
    handleScroll();
    
    // Kembalikan cleanup function
    return () => window.removeEventListener('scroll', handleScroll);
  };

  useEffect(() => {
    // Untuk web
    if (Platform.OS === 'web' && viewRef.current) {
      const element = viewRef.current;
      
      // Hapus semua style dan animasi
      if (element) {
        element.style.animation = '';
        element.style.transition = '';
        element.style.transform = '';
        element.style.opacity = '';
      }
      
      // Tambahkan keyframes untuk animasi khusus
      if (['pulse', 'float', 'bounce', 'attention'].includes(animation)) {
        const existingStyle = document.getElementById('animated-view-keyframes');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'animated-view-keyframes';
        styleSheet.textContent = getAnimationKeyframes();
        document.head.appendChild(styleSheet);
      }
      
      // Gunakan IntersectionObserver untuk trigger on scroll
      if (triggerOnScroll && animation !== 'parallax') {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                console.log(`Element is intersecting, animation: ${animation}`);
                setIsVisible(true);
                applyAnimation(element);
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        
        if (element) {
          observer.observe(element);
          
          return () => {
            observer.unobserve(element);
          };
        }
      } else {
        // Langsung terapkan animasi
        if (element) {
          setTimeout(() => {
            applyAnimation(element);
          }, 0);
        }
      }
      
      return;
    }
    
    // Untuk React Native
    if (isVisible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  }, [animation, duration, delay, isVisible, triggerOnScroll, normalizedIntensity, infinite, parallaxDirection, parallaxSpeed]);

  // Untuk React Native - styles
  const getNativeAnimationStyle = () => {
    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return { opacity: 0 };
        case 'fadeOut':
          return { opacity: 1 };
        case 'slideUp':
          return { opacity: 0, transform: [{ translateY: 50 * normalizedIntensity }] };
        case 'slideDown':
          return { opacity: 0, transform: [{ translateY: -50 * normalizedIntensity }] };
        case 'slideLeft':
          return { opacity: 0, transform: [{ translateX: 50 * normalizedIntensity }] };
        case 'slideRight':
          return { opacity: 0, transform: [{ translateX: 100 * normalizedIntensity }] };
        case 'scale':
          return { opacity: 0, transform: [{ scale: 0.8 }] };
        default:
          return { opacity: 0 };
      }
    }
    
    switch (animation) {
      case 'fadeIn':
        return { opacity: animatedValue };
      case 'fadeOut':
        return {
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        };
      case 'slideUp':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * normalizedIntensity, 0],
              }),
            },
          ],
        };
      case 'slideDown':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50 * normalizedIntensity, 0],
              }),
            },
          ],
        };
      case 'slideLeft':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50 * normalizedIntensity, 0],
              }),
            },
          ],
        };
      case 'slideRight':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100 * normalizedIntensity, 0],
              }),
            },
          ],
        };
      default:
        return { opacity: animatedValue };
    }
  };

  // Native platform menggunakan Animated
  const finalStyle = Platform.OS === 'web' 
    ? style 
    : [style, getNativeAnimationStyle()];

  return (
    <Animated.View 
      style={finalStyle} 
      ref={viewRef}
      {...props}
    >
      {children}
    </Animated.View>
  );
};