// app/(tabs)/rewards.tsx
import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconGift, IconCoin, IconCheck, IconLogout, IconLock } from '@tabler/icons-react-native';
import { useUser } from '@/context/UserContext';
import CoinsDisplay from '@/components/ui/CoinsDisplay';
import { rewardsStyles as s } from '@/styles/screens/rewardsStyles';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type Reward = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  cost: number;
  color: string;
};

const REWARDS: Reward[] = [
  {
    id: 'toothbrush',
    emoji: '🪥',
    title: 'New Toothbrush',
    description: 'Earn a brand-new toothbrush of your choice!',
    cost: 30,
    color: '#4A90E2',
  },
  {
    id: 'chocolate',
    emoji: '🍫',
    title: 'Golden Coin Chocolate',
    description: 'A bag of delicious golden coin chocolates!',
    cost: 20,
    color: '#F39C12',
  },
  {
    id: 'freetime',
    emoji: '🎉',
    title: 'Free Time',
    description: 'Trade your coins for 30 minutes of extra free time!',
    cost: 50,
    color: '#9B59B6',
  },
  {
    id: 'stickers',
    emoji: '⭐',
    title: 'Sticker Pack',
    description: 'Pick any sticker pack from the store!',
    cost: 15,
    color: '#2ECC71',
  },
  {
    id: 'movie',
    emoji: '🎬',
    title: 'Movie Night',
    description: 'Choose a movie to watch with the family!',
    cost: 60,
    color: '#E74C3C',
  },
];

function RewardCard({
  reward,
  coins,
  claimedAt,
  onClaim,
}: {
  reward: Reward;
  coins: number;
  claimedAt: number | null;
  onClaim: (reward: Reward) => void;
}) {
  const [justClaimed, setJustClaimed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const msElapsed = claimedAt != null ? Date.now() - claimedAt : SEVEN_DAYS_MS;
  const isLocked = msElapsed < SEVEN_DAYS_MS;
  const daysLeft = isLocked
    ? Math.ceil((SEVEN_DAYS_MS - msElapsed) / (24 * 60 * 60 * 1000))
    : 0;

  const canAfford = coins >= reward.cost;

  const handlePress = () => {
    if (!canAfford || justClaimed || isLocked) return;
    onClaim(reward);
    setJustClaimed(true);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.03,
        useNativeDriver: true,
        speed: 40,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start(() => {
      setTimeout(() => setJustClaimed(false), 3000);
    });
  };

  const renderButton = () => {
    if (isLocked) {
      return (
        <View style={s.lockedBadge}>
          <IconLock stroke="#AAAAAA" size={14} strokeWidth={2.5} />
          <Text style={s.lockedBadgeText}>
            {daysLeft === 1 ? 'Available tomorrow' : `Available in ${daysLeft} days`}
          </Text>
        </View>
      );
    }
    if (justClaimed) {
      return (
        <View style={s.claimedBadge}>
          <IconCheck stroke="#AAAAAA" size={15} strokeWidth={2.5} />
          <Text style={s.claimedBadgeText}>Claimed!</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={!canAfford}
        style={[
          s.claimBtn,
          { backgroundColor: reward.color },
          !canAfford && s.claimBtnDisabled,
        ]}
      >
        <IconCoin
          stroke={canAfford ? '#fff' : '#BBBBBB'}
          size={15}
          strokeWidth={2}
        />
        <Text style={[s.claimBtnText, !canAfford && s.claimBtnTextDisabled]}>
          {reward.cost} coins
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        s.rewardCard,
        { borderColor: reward.color + '55', transform: [{ scale: scaleAnim }] },
        (justClaimed || isLocked) && s.rewardCardClaimed,
      ]}
    >
      <View style={[s.emojiCircle, { backgroundColor: reward.color + '18' }]}>
        <Text style={s.rewardEmoji}>{reward.emoji}</Text>
      </View>

      <View style={s.rewardInfo}>
        <Text style={s.rewardTitle}>{reward.title}</Text>
        <Text style={s.rewardDesc}>{reward.description}</Text>
        {renderButton()}
      </View>
    </Animated.View>
  );
}

export default function RewardsScreen() {
  const { activeUser, claimedRewards, claimReward, loadClaimedRewards, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    loadClaimedRewards();
  }, [loadClaimedRewards]);

  const handleClaim = async (reward: Reward) => {
    await claimReward(reward.id, reward.cost);
  };

  const coins = activeUser?.coins ?? 0;

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ── Header ─────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerTopRow}>
            <View style={s.headerRow}>
              <IconGift stroke="#2D2D2D" size={28} strokeWidth={2} />
              <Text style={s.headerTitle}>Rewards</Text>
            </View>
            <View style={s.headerRight}>
              {activeUser && <CoinsDisplay coins={coins} />}
              <TouchableOpacity
                onPress={() => {
                  logout();
                  router.replace('/');
                }}
                activeOpacity={0.7}
              >
                <IconLogout stroke="#AAAAAA" size={22} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={s.headerSubtitle}>
            Spend your coins on something fun! 🎁
          </Text>
        </View>

        {/* ── Reward cards ───────────────────────────── */}
        <Text style={s.sectionTitle}>Available Rewards</Text>
        {REWARDS.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            coins={coins}
            claimedAt={claimedRewards[reward.id] ?? null}
            onClaim={handleClaim}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
