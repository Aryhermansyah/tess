import { Platform } from 'react-native';

// Interface untuk properti animasi
export interface AnimationProps {
  animation?: 
    | 'fadeIn' 
    | 'fadeInUp' 
    | 'fadeInDown' 
    | 'fadeInLeft' 
    | 'fadeInRight'
    | 'fadeOut'
    | 'zoomIn'
    | 'zoomOut'
    | 'slideUp'
    | 'slideDown'
    | 'pulse'
    | 'shake'
    | 'rotate'
    | 'bounce'
    | 'float'
    | 'swing'
    | 'shimmer'
    | 'ripple'
    | 'heartbeat'
    | 'flipX'
    | 'flipY'
    | 'none';
  duration?: number;
  delay?: number;
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  easing?: string;
}

// Fungsi untuk menyuntikkan gaya animasi CSS ke dalam dokumen web
export const injectAnimationStyles = () => {
  if (Platform.OS !== 'web') return;

  // Cek apakah stylesheet sudah ada
  const id = 'roundwon-animations-stylesheet';
  if (document.getElementById(id)) return;

  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    /* === Keyframes === */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translate3d(0, 40px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    @keyframes fadeInDown {
      from { opacity: 0; transform: translate3d(0, -40px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translate3d(-40px, 0, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    @keyframes fadeInRight {
      from { opacity: 0; transform: translate3d(40px, 0, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes zoomIn {
      from { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
      50% { opacity: 1; }
    }
    
    @keyframes zoomOut {
      from { opacity: 1; }
      50% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
      to { opacity: 0; }
    }
    
    @keyframes slideUp {
      from { transform: translate3d(0, 40px, 0); }
      to { transform: translate3d(0, 0, 0); }
    }
    
    @keyframes slideDown {
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(0, 40px, 0); }
    }
    
    @keyframes bounce {
      from, 20%, 53%, 80%, to { transform: translate3d(0, 0, 0); }
      40%, 43% { transform: translate3d(0, -30px, 0); }
      70% { transform: translate3d(0, -15px, 0); }
      90% { transform: translate3d(0, -4px, 0); }
    }
    
    @keyframes pulse {
      from { transform: scale3d(1, 1, 1); }
      50% { transform: scale3d(1.05, 1.05, 1.05); }
      to { transform: scale3d(1, 1, 1); }
    }
    
    @keyframes shake {
      from, to { transform: translate3d(0, 0, 0); }
      10%, 30%, 50%, 70%, 90% { transform: translate3d(-10px, 0, 0); }
      20%, 40%, 60%, 80% { transform: translate3d(10px, 0, 0); }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes ripple {
      0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4); }
      100% { box-shadow: 0 0 0 20px rgba(0, 122, 255, 0); }
    }
    
    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
    }
    
    @keyframes flipX {
      from { transform: perspective(400px) rotateX(90deg); opacity: 0; }
      40% { transform: perspective(400px) rotateX(-10deg); }
      70% { transform: perspective(400px) rotateX(10deg); }
      to { transform: perspective(400px) rotateX(0deg); opacity: 1; }
    }
    
    @keyframes flipY {
      from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
      40% { transform: perspective(400px) rotateY(-10deg); }
      70% { transform: perspective(400px) rotateY(10deg); }
      to { transform: perspective(400px) rotateY(0deg); opacity: 1; }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes swing {
      20% { transform: rotate3d(0, 0, 1, 15deg); }
      40% { transform: rotate3d(0, 0, 1, -10deg); }
      60% { transform: rotate3d(0, 0, 1, 5deg); }
      80% { transform: rotate3d(0, 0, 1, -5deg); }
      to { transform: rotate3d(0, 0, 1, 0deg); }
    }
    
    /* === Kelas Animasi === */
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    
    .animate-fade-in-down {
      animation: fadeInDown 0.5s ease-out forwards;
    }
    
    .animate-fade-in-left {
      animation: fadeInLeft 0.5s ease-out forwards;
    }
    
    .animate-fade-in-right {
      animation: fadeInRight 0.5s ease-out forwards;
    }
    
    .animate-fade-out {
      animation: fadeOut 0.5s ease-out forwards;
    }
    
    .animate-zoom-in {
      animation: zoomIn 0.5s ease-out forwards;
    }
    
    .animate-zoom-out {
      animation: zoomOut 0.5s ease-out forwards;
    }
    
    .animate-slide-up {
      animation: slideUp 0.5s ease-out forwards;
    }
    
    .animate-slide-down {
      animation: slideDown 0.5s ease-out forwards;
    }
    
    .animate-bounce {
      animation: bounce 1s ease-out;
    }
    
    .animate-pulse {
      animation: pulse 1s ease-in-out infinite;
    }
    
    .animate-shake {
      animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    .animate-rotate {
      animation: rotate 1s linear infinite;
    }
    
    .animate-shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
    }
    
    .animate-ripple {
      animation: ripple 1.5s ease-out infinite;
    }
    
    .animate-heartbeat {
      animation: heartbeat 1.5s ease-in-out infinite;
    }
    
    .animate-flip-x {
      animation: flipX 1s ease-out forwards;
      backface-visibility: visible !important;
    }
    
    .animate-flip-y {
      animation: flipY 1s ease-out forwards;
      backface-visibility: visible !important;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .animate-swing {
      transform-origin: top center;
      animation: swing 1s ease-in-out;
    }
  `;
  
  document.head.appendChild(style);
};

// Objek pemetaan untuk nama animasi ke kelas animasi
const animationClassMap: Record<string, string> = {
  'fadeIn': 'animate-fade-in',
  'fadeInUp': 'animate-fade-in-up',
  'fadeInDown': 'animate-fade-in-down',
  'fadeInLeft': 'animate-fade-in-left',
  'fadeInRight': 'animate-fade-in-right',
  'fadeOut': 'animate-fade-out',
  'zoomIn': 'animate-zoom-in',
  'zoomOut': 'animate-zoom-out',
  'slideUp': 'animate-slide-up',
  'slideDown': 'animate-slide-down',
  'bounce': 'animate-bounce',
  'pulse': 'animate-pulse',
  'shake': 'animate-shake',
  'rotate': 'animate-rotate',
  'shimmer': 'animate-shimmer',
  'ripple': 'animate-ripple',
  'heartbeat': 'animate-heartbeat',
  'flipX': 'animate-flip-x',
  'flipY': 'animate-flip-y',
  'float': 'animate-float',
  'swing': 'animate-swing'
};

// Fungsi untuk mendapatkan nama kelas animasi dari nama animasi
export const getAnimationClass = (animationName: string): string => {
  return animationClassMap[animationName] || '';
};

// Fungsi untuk membuat string kelas dengan durasi dan penundaan khusus
export const createAnimationStyle = (
  animationName: string, 
  duration?: number, 
  delay?: number, 
  iterationCount?: number | 'infinite',
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse',
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both',
  easing?: string
): Record<string, string> => {
  const className = getAnimationClass(animationName);
  
  if (!className) return {};
  
  return {
    animationName: animationName,
    animationDuration: duration ? `${duration}ms` : '500ms',
    animationDelay: delay ? `${delay}ms` : '0ms',
    animationIterationCount: iterationCount ? (iterationCount === 'infinite' ? 'infinite' : `${iterationCount}`) : '1',
    animationDirection: direction || 'normal',
    animationFillMode: fillMode || 'both',
    animationTimingFunction: easing || 'ease-out',
  };
};

// Fungsi untuk mendapatkan style inline untuk animasi (untuk durasi dan delay kustom)
export const getAnimationStyle = (props: AnimationProps) => {
  if (Platform.OS !== 'web' || !props.animation || props.animation === 'none') {
    return {};
  }
  
  const style: any = {};
  
  // Tambahkan durasi kustom
  if (props.duration) {
    style.animationDuration = `${props.duration}ms`;
  }
  
  // Tambahkan delay kustom
  if (props.delay) {
    style.animationDelay = `${props.delay}ms`;
  }
  
  return style;
};

// Fungsi untuk menambahkan class ke element web
export const applyAnimationClass = (element: HTMLElement, animationProps: AnimationProps) => {
  if (Platform.OS !== 'web' || !element) return;
  
  const animationClass = getAnimationClass(animationProps.animation || '');
  if (animationClass) {
    element.classList.add(animationClass);
  }
  
  // Tambahkan style inline untuk durasi dan delay kustom
  const animationStyle = getAnimationStyle(animationProps);
  if (Object.keys(animationStyle).length > 0) {
    Object.assign(element.style, animationStyle);
  }
};

// Fungsi untuk menambahkan animasi staggered ke list items
export const applyStaggeredAnimation = (containerSelector: string, itemSelector: string, baseDelay: number = 100) => {
  if (Platform.OS !== 'web') return;
  
  try {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const items = container.querySelectorAll(itemSelector);
    
    items.forEach((item, index) => {
      const delay = baseDelay * (index + 1);
      (item as HTMLElement).style.animationDelay = `${delay}ms`;
    });
  } catch (error) {
    console.error('Failed to apply staggered animation:', error);
  }
};

// Preset animasi untuk elemen-elemen umum
export const animationPresets = {
  // Cards
  card: {
    animation: 'fadeIn',
    duration: 500,
  } as AnimationProps,
  
  cardHover: {
    animation: 'zoomIn',
    duration: 300,
  } as AnimationProps,
  
  // Lists
  listItem: {
    animation: 'fadeInLeft',
    duration: 500,
  } as AnimationProps,
  
  // Headers
  header: {
    animation: 'fadeInDown',
    duration: 800,
  } as AnimationProps,
  
  // Buttons
  button: {
    animation: 'fadeIn',
    duration: 300,
  } as AnimationProps,
  
  buttonSubmit: {
    animation: 'pulse',
    duration: 2000,
  } as AnimationProps,
  
  // Forms
  formInput: {
    animation: 'fadeIn',
    duration: 500,
    delay: 200,
  } as AnimationProps,
  
  // Modals
  modalEnter: {
    animation: 'zoomIn',
    duration: 300,
  } as AnimationProps,
  
  modalExit: {
    animation: 'zoomOut',
    duration: 300,
  } as AnimationProps,
  
  // Page transitions
  pageEnter: {
    animation: 'fadeIn',
    duration: 800,
  } as AnimationProps,
  
  pageExit: {
    animation: 'fadeOut',
    duration: 300,
  } as AnimationProps,
  
  // Specific elements
  rundownItem: {
    animation: 'fadeInRight',
    duration: 500,
  } as AnimationProps,
  
  eventCard: {
    animation: 'fadeIn',
    duration: 500,
  } as AnimationProps,
  
  couplePhoto: {
    animation: 'fadeIn',
    duration: 1000,
  } as AnimationProps,
  
  venueCard: {
    animation: 'fadeInUp',
    duration: 800,
  } as AnimationProps,
  
  scheduleItem: {
    animation: 'slideUp',
    duration: 500,
  } as AnimationProps,
};

export default {
  injectAnimationStyles,
  getAnimationClass,
  createAnimationStyle,
  getAnimationStyle,
  applyAnimationClass,
  applyStaggeredAnimation,
  animationPresets,
}; 