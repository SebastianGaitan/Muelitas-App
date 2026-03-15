// components/ui/CoinsDisplay.tsx
import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { IconCoin } from '@tabler/icons-react-native';
import { coinsDisplayStyles as s } from '@/styles/ui/coinsDisplayStyles';

type Props = {
  coins: number;
};

export default function CoinsDisplay({ coins }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevCoins = useRef(coins);

  // ── Pop animation whenever coins increase ─────────────
  useEffect(() => {
    if (coins > prevCoins.current) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.4,
          useNativeDriver: true,
          speed: 30,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();
    }
    prevCoins.current = coins;
  }, [coins]);

  return (
    <Animated.View style={[s.container, { transform: [{ scale: scaleAnim }] }]}>
      <IconCoin stroke="#F39C12" size={18} strokeWidth={2} />
      <Text style={s.coinCount}>{coins}</Text>
    </Animated.View>
  );
}
