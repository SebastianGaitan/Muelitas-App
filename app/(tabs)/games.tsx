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
              <Text style={s.headerTitle}>Juegos</Text>
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
          <Text style={s.headerSubtitle}>¡Juega y gana monedas! 🎮</Text>
        </View>

        {/* ── Catch Game ───────────────────────────── */}
        <View style={[s.gameCard, { borderColor: accentColor + '55' }]}>
          <Text style={s.gameTitle}>🥦 Come Sano</Text>
          <Text style={s.gameSubtitle}>
            ¡Atrapa comida saludable por 2 minutos — gana {CATCH_COINS} monedas!
          </Text>
          <CatchGame
            accentColor={accentColor}
            onWin={() => addCoins(CATCH_COINS)}
          />
        </View>

        {/* ── Crossword ────────────────────────────── */}
        <View style={[s.gameCard, { borderColor: accentColor + '55' }]}>
          <Text style={s.gameTitle}>Crucigrama Dental</Text>
          <Text style={s.gameSubtitle}>
            ¡Resuelve el crucigrama dental — gana {CROSSWORD_COINS} monedas!
          </Text>
          <CrosswordGame
            accentColor={accentColor}
            onWin={() => addCoins(CROSSWORD_COINS)}
          />
        </View>

        {/* ── Word Search ──────────────────────────── */}
        <View style={[s.gameCard, { borderColor: accentColor + '55' }]}>
          <Text style={s.gameTitle}>Sopa de Letras</Text>
          <Text style={s.gameSubtitle}>
            ¡Encuentra las 10 palabras dentales escondidas — gana{' '}
            {WORDSEARCH_COINS} monedas!
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
