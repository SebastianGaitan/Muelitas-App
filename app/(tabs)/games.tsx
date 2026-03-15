// app/(tabs)/games.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconDeviceGamepad2, IconLogout } from '@tabler/icons-react-native';
import { useUser } from '@/context/UserContext';
import CoinsDisplay from '@/components/ui/CoinsDisplay';
import CatchGame from '@/components/games/CatchGame';
import CrosswordGame from '@/components/games/CrosswordGame';
import { gamesStyles as s } from '@/styles/screens/gamesStyles';
import WordSearchGame from '@/components/games/WordSearchGame';

const CATCH_COINS = 10;
const CROSSWORD_COINS = 15;
const WORDSEARCH_COINS = 20;

export default function GamesScreen() {
  const { activeUser, addCoins, logout } = useUser();
  const router = useRouter();

  const accentColor = activeUser?.borderColor ?? '#FF6B9D';

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        {/* ── Header ───────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerTopRow}>
            <View style={s.headerRow}>
              <IconDeviceGamepad2 stroke="#2D2D2D" size={28} strokeWidth={2} />
              <Text style={s.headerTitle}>Games</Text>
            </View>
            <View style={s.headerRight}>
              {activeUser && <CoinsDisplay coins={activeUser.coins} />}
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
          <Text style={s.headerSubtitle}>Play games and earn coins! 🎮</Text>
        </View>

        {/* ── Catch Game ───────────────────────────── */}
        <View style={[s.gameCard, { borderColor: accentColor + '55' }]}>
          <Text style={s.gameTitle}>🥦 Healthy Munch</Text>
          <Text style={s.gameSubtitle}>
            Catch healthy food for 2 minutes — earn {CATCH_COINS} coins!
          </Text>
          <CatchGame
            accentColor={accentColor}
            onWin={() => addCoins(CATCH_COINS)}
          />
        </View>

        {/* ── Crossword ────────────────────────────── */}
        <View style={[s.gameCard, { borderColor: accentColor + '55' }]}>
          <Text style={s.gameTitle}>Dental Crossword</Text>
          <Text style={s.gameSubtitle}>
            Solve the dental crossword puzzle — earn {CROSSWORD_COINS} coins!
          </Text>
          <CrosswordGame
            accentColor={accentColor}
            onWin={() => addCoins(CROSSWORD_COINS)}
          />
        </View>

        {/* ── Word Search ──────────────────────────── */}
        <View style={[s.gameCard, { borderColor: accentColor + '55' }]}>
          <Text style={s.gameTitle}>Word Search</Text>
          <Text style={s.gameSubtitle}>
            Find all 10 dental words hidden in the grid — earn{' '}
            {WORDSEARCH_COINS} coins!
          </Text>
          <WordSearchGame
            accentColor={accentColor}
            onWin={() => addCoins(WORDSEARCH_COINS)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
