// components/games/CatchGame.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { IconCoin, IconX } from '@tabler/icons-react-native';
import {
  catchGameStyles as s,
  CHARACTER_W,
  CATCH_TOLERANCE,
} from '@/styles/games/catchGameStyles';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const GAME_WIDTH = SCREEN_W;
const GAME_HEIGHT = SCREEN_H;
const ITEM_SIZE = 32;
const MOVE_STEP = SCREEN_W * 0.1;

// ── Constants ─────────────────────────────────────────
const GAME_DURATION = 120;
const SPAWN_INTERVAL = 900;
const MAX_LIVES = 3;
const WIN_COINS = 10;
const FALL_SPEED_MIN = 2200;
const FALL_SPEED_MAX = 3800;

// ── Sprite assets ─────────────────────────────────────
type FoodSprite = { source: ImageSourcePropType; isHealthy: boolean };

const FOOD_ITEMS: FoodSprite[] = [
  { source: require('../../assets/sprites/fruits/Apple.png'), isHealthy: true },
  {
    source: require('../../assets/sprites/fruits/Avocado.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/fruits/Banana.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/fruits/Blueberry.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/fruits/Cherry.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/fruits/Green_Apple.png'),
    isHealthy: true,
  },
  { source: require('../../assets/sprites/fruits/Kiwi.png'), isHealthy: true },
  {
    source: require('../../assets/sprites/fruits/Orange.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/fruits/Papaya.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/fruits/Strawberry.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Broccoli.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Cabbage.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Carrot.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Chilli_Pepper.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Common_Mushroom.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Corn.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Eggplant.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Lettuce.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Potato.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/vegetables/Zuccini.png'),
    isHealthy: true,
  },
  {
    source: require('../../assets/sprites/junkFood/boba_mango.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/boba_milktea.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/cake_cheese.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/cake_chocolate.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/coffee_tea.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/icecream_1scoop.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/popsicle_green.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/soda_fanta.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/soda_pepsi.png'),
    isHealthy: false,
  },
  {
    source: require('../../assets/sprites/junkFood/soda_sprite.png'),
    isHealthy: false,
  },
];

const HEALTHY_POOL = FOOD_ITEMS.filter((f) => f.isHealthy);
const UNHEALTHY_POOL = FOOD_ITEMS.filter((f) => !f.isHealthy);

type FoodItem = {
  id: number;
  x: number;
  source: ImageSourcePropType;
  isHealthy: boolean;
  animY: Animated.Value;
  caught: boolean;
};

type GameState = 'idle' | 'playing' | 'won' | 'lost';
type ScoreFlash = {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  anim: Animated.Value;
};

type Props = {
  accentColor: string;
  onWin: () => void;
};

export default function CatchGame({ accentColor, onWin }: Props) {
  const insets = useSafeAreaInsets();
  const [fullscreen, setFullscreen] = useState(false);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [flashes, setFlashes] = useState<ScoreFlash[]>([]);
  const [charX, setCharX] = useState(SCREEN_W / 2 - CHARACTER_W / 2);

  const itemsRef = useRef<FoodItem[]>([]);
  const charXRef = useRef(charX);
  const livesRef = useRef(lives);
  const idCounter = useRef(0);
  const gameRunning = useRef(false);

  charXRef.current = charX;
  livesRef.current = lives;
  itemsRef.current = items;

  const resetGame = () => {
    setGameState('idle');
    setLives(MAX_LIVES);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setFlashes([]);
    setCharX(SCREEN_W / 2 - CHARACTER_W / 2);
    itemsRef.current = [];
    livesRef.current = MAX_LIVES;
    gameRunning.current = false;
  };

  const handleExit = () => {
    resetGame();
    setFullscreen(false);
  };

  // ── Spawn ─────────────────────────────────────────────
  const spawnItem = useCallback(() => {
    const isHealthy = Math.random() > 0.35;
    const pool = isHealthy ? HEALTHY_POOL : UNHEALTHY_POOL;
    const food = pool[Math.floor(Math.random() * pool.length)];
    const x = Math.random() * (SCREEN_W - ITEM_SIZE);
    const animY = new Animated.Value(-ITEM_SIZE);
    const id = idCounter.current++;
    const duration =
      FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN);
    const newItem: FoodItem = {
      id,
      x,
      source: food.source,
      isHealthy,
      animY,
      caught: false,
    };

    setItems((prev) => {
      const u = [...prev, newItem];
      itemsRef.current = u;
      return u;
    });

    Animated.timing(animY, {
      toValue: SCREEN_H,
      duration,
      useNativeDriver: false,
    }).start(() => {
      setItems((prev) => {
        const u = prev.filter((i) => i.id !== id);
        itemsRef.current = u;
        return u;
      });
    });
  }, []);

  // ── Collision ─────────────────────────────────────────
  const addFlash = (x: number, y: number, text: string, color: string) => {
    const id = idCounter.current++;
    const anim = new Animated.Value(1);
    setFlashes((prev) => [...prev, { id, x, y, text, color, anim }]);
    Animated.timing(anim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      setFlashes((prev) => prev.filter((f) => f.id !== id));
    });
  };

  const endGame = useCallback(
    (result: 'won' | 'lost') => {
      gameRunning.current = false;
      setGameState(result);
      if (result === 'won') onWin();
    },
    [onWin],
  );

  const checkCollisions = useCallback(() => {
    const charCenter = charXRef.current + CHARACTER_W / 2;
    const catchY = SCREEN_H - 120;

    itemsRef.current.forEach((item) => {
      if (item.caught) return;
      const currentY = (item.animY as any)._value as number;
      if (currentY < catchY - 30 || currentY > catchY + 30) return;
      const itemCenter = item.x + ITEM_SIZE / 2;
      if (
        Math.abs(itemCenter - charCenter) <
        CHARACTER_W / 2 + CATCH_TOLERANCE
      ) {
        item.caught = true;
        item.animY.stopAnimation();
        setItems((prev) => {
          const u = prev.filter((i) => i.id !== item.id);
          itemsRef.current = u;
          return u;
        });
        if (item.isHealthy) {
          setScore((s) => s + 1);
          addFlash(item.x, catchY, '+1', '#27AE60');
        } else {
          addFlash(item.x, catchY, '💔', '#E74C3C');
          setLives((prev) => {
            const next = prev - 1;
            livesRef.current = next;
            if (next <= 0) endGame('lost');
            return next;
          });
        }
      }
    });
  }, [endGame]);

  // ── Timers ────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame('won');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const spawner = setInterval(() => {
      if (gameRunning.current) spawnItem();
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawner);
  }, [gameState, spawnItem]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const collider = setInterval(checkCollisions, 80);
    return () => clearInterval(collider);
  }, [gameState, checkCollisions]);

  const startGame = () => {
    setGameState('playing');
    setLives(MAX_LIVES);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setFlashes([]);
    setCharX(SCREEN_W / 2 - CHARACTER_W / 2);
    itemsRef.current = [];
    livesRef.current = MAX_LIVES;
    gameRunning.current = true;
  };

  const moveLeft = () => setCharX((prev) => Math.max(0, prev - MOVE_STEP));
  const moveRight = () =>
    setCharX((prev) => Math.min(SCREEN_W - CHARACTER_W, prev + MOVE_STEP));

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Preview card (before fullscreen) ─────────────────
  return (
    <>
      {/* Preview card shown in games screen */}
      {!fullscreen && (
        <TouchableOpacity
          style={[s.previewBtn, { backgroundColor: accentColor }]}
          onPress={() => setFullscreen(true)}
          activeOpacity={0.85}
        >
          <Text style={s.previewBtnText}>🎮 Play Now!</Text>
        </TouchableOpacity>
      )}

      {/* Fullscreen game modal */}
      <Modal
        visible={fullscreen}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleExit}
      >
        <StatusBar hidden />
        <View style={s.fullscreen}>
          {/* ── HUD ──────────────────────────────── */}
          <View style={[s.hud, { paddingTop: insets.top + 12 }]}>
            <View style={s.hudLives}>
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <Text key={i} style={s.hudLifeIcon}>
                  {i < lives ? '🦷' : '🩶'}
                </Text>
              ))}
            </View>
            <Text style={[s.hudTimer, timeLeft <= 15 && s.hudTimerWarning]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={s.hudScore}>🥗 {score}</Text>

            {/* Exit button */}
            <TouchableOpacity
              style={s.exitBtn}
              onPress={handleExit}
              activeOpacity={0.8}
            >
              <IconX stroke="#fff" size={18} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* ── Board ────────────────────────────── */}
          <View style={s.board}>
            {/* Falling items */}
            {items.map((item) => (
              <Animated.View
                key={item.id}
                style={[s.item, { left: item.x, top: item.animY }]}
              >
                <Image
                  source={item.source}
                  style={s.itemSprite}
                  resizeMode="contain"
                />
              </Animated.View>
            ))}

            {/* Character */}
            <View style={[s.character, { left: charX }]}>
              <Text style={s.characterEmoji}>🧒</Text>
            </View>

            {/* Score flashes */}
            {flashes.map((flash) => (
              <Animated.Text
                key={flash.id}
                style={[
                  s.scoreFlash,
                  {
                    left: flash.x,
                    top: flash.y - 20,
                    color: flash.color,
                    opacity: flash.anim,
                  },
                ]}
              >
                {flash.text}
              </Animated.Text>
            ))}

            {/* ── Overlays ─────────────────────── */}
            {gameState === 'idle' && (
              <View style={s.overlay}>
                <Text style={s.overlayEmoji}>🎮</Text>
                <Text style={s.overlayTitle}>Catch the healthy food!</Text>
                <Text style={s.overlaySubtitle}>
                  Eat fruits & veggies, avoid junk food!{'\n'}Survive 2 minutes
                  to win!
                </Text>
                <TouchableOpacity
                  style={[s.startBtn, { backgroundColor: accentColor }]}
                  onPress={startGame}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>Start Game!</Text>
                </TouchableOpacity>
              </View>
            )}

            {gameState === 'won' && (
              <View style={s.overlay}>
                <Text style={s.overlayEmoji}>🏆</Text>
                <Text style={s.overlayTitle}>Amazing! You won!</Text>
                <Text style={s.overlaySubtitle}>
                  You survived with {lives} tooth/teeth left!
                </Text>
                <View style={s.overlayCoins}>
                  <IconCoin stroke="#F39C12" size={24} strokeWidth={2} />
                  <Text style={s.overlayCoinsText}>+{WIN_COINS} coins</Text>
                </View>
                <TouchableOpacity
                  style={[s.startBtn, { backgroundColor: accentColor }]}
                  onPress={startGame}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>Play Again!</Text>
                </TouchableOpacity>
              </View>
            )}

            {gameState === 'lost' && (
              <View style={s.overlay}>
                <Text style={s.overlayEmoji}>😢</Text>
                <Text style={s.overlayTitle}>Oh no! Try again!</Text>
                <Text style={s.overlaySubtitle}>
                  Don't eat the sugary stuff!
                </Text>
                <TouchableOpacity
                  style={[s.startBtn, { backgroundColor: accentColor }]}
                  onPress={startGame}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>Try Again!</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ── Controls ─────────────────────────── */}
          {gameState === 'playing' && (
            <View style={[s.controls, { paddingBottom: insets.bottom + 8 }]}>
              <TouchableOpacity
                style={s.controlBtn}
                onPress={moveLeft}
                activeOpacity={0.7}
              >
                <Text style={s.controlBtnText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.controlBtn}
                onPress={moveRight}
                activeOpacity={0.7}
              >
                <Text style={s.controlBtnText}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
