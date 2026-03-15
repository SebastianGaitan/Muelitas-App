// components/UserCard.tsx
import { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Image, Text, View } from 'react-native';
import { User } from '@/constants/users';
import { cardStyles as styles, CARD_SIZE } from '@/styles/screens/loginStyles';

type Props = {
  user: User;
  onPress: () => void;
  onLongPress: () => void;
  delay?: number;
};

export default function UserCard({
  user,
  onPress,
  onLongPress,
  delay = 0,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const combinedScale = Animated.multiply(scaleAnim, pressAnim);

  // ── Entry spring ─────────────────────────────
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── Long press shake ─────────────────────────
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleLongPress = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 4,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start(() => onLongPress());
  };

  // ── Press feedback ───────────────────────────
  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 80,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { transform: [{ scale: combinedScale }, { translateX: shakeAnim }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        {/* ── Square avatar card ──────────────── */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: user.color,
              borderColor: user.borderColor,
              width: CARD_SIZE,
              height: CARD_SIZE,
            },
          ]}
        >
          {/* Corner dots */}
          <View
            style={[
              styles.dot,
              styles.dotTL,
              { backgroundColor: user.borderColor },
            ]}
          />
          <View
            style={[
              styles.dot,
              styles.dotTR,
              { backgroundColor: user.borderColor },
            ]}
          />
          <View
            style={[
              styles.dot,
              styles.dotBL,
              { backgroundColor: user.borderColor },
            ]}
          />
          <View
            style={[
              styles.dot,
              styles.dotBR,
              { backgroundColor: user.borderColor },
            ]}
          />

          {/* photo (camera) > avatar (bundled) > emoji */}
          {user.photo ? (
            <Image
              source={{ uri: user.photo }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : user.avatar ? (
            <Image
              source={user.avatar}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.emoji}>{user.emoji}</Text>
          )}
        </View>

        {/* ── Name tag ────────────────────────── */}
        <View style={[styles.nameTag, { backgroundColor: user.borderColor }]}>
          <Text style={styles.nameText}>{user.name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
