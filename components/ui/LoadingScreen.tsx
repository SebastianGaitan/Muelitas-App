// components/LoadingScreen.tsx
import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width * 0.65;

type Props = { duration?: number };

export default function LoadingScreen({ duration = 2000 }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in whole screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Gentle pulse on the image
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Bar fills exactly once over the same duration as the loading timer
    Animated.timing(barAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH],
  });

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom', 'left', 'right']}>
      <Animated.View style={[s.container, { opacity: fadeAnim }]}>
        {/* ── Image ────────────────────────────────── */}
        <Animated.Image
          source={require('../../assets/images/icon.png')}
          style={[s.image, { transform: [{ scale: pulseAnim }] }]}
          resizeMode="contain"
        />

        {/* ── Label ────────────────────────────────── */}
        <Text style={s.label}>Cargando...</Text>

        {/* ── Loading bar ──────────────────────────── */}
        <View style={s.barTrack}>
          <Animated.View style={[s.barFill, { width: barWidth }]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  // ── Image ──────────────────────────────────────
  image: {
    width: 140,
    height: 140,
  },

  // ── Label ──────────────────────────────────────
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#CCCCCC',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // ── Bar ────────────────────────────────────────
  barTrack: {
    width: BAR_WIDTH,
    height: 10,
    backgroundColor: '#F0EDE4',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 10,
  },
});
