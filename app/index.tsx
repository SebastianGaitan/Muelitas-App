// app/index.tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconPlus } from '@tabler/icons-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { USERS, User } from '@/constants/users';
import { useUser } from '@/context/UserContext';
import UserCard from '@/components/ui/UserCard';
import AddKidModal from '@/components/modals/AddKidModal';
import DeleteUserModal from '@/components/modals/DeleteUserModal';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { loginStyles as styles, CARD_SIZE } from '@/styles/screens/loginStyles';
import { newUserStyles as nStyles } from '@/styles/modals/newUserStyles';

// ── Constants ─────────────────────────────────────────
const STORAGE_KEY = 'muelitas:users';
const LOADING_DURATION = 2000; // ms — change this to adjust loading screen time

const GREETINGS = [
  { greeting: '¡Hola!', subtitle: '¿Quién está ahí?', flag: '🇨🇴' },
  { greeting: 'Hello!', subtitle: "Who's there?", flag: '🇺🇸' },
  { greeting: 'Bonjour!', subtitle: 'Qui est là ?', flag: '🇫🇷' },
  { greeting: 'こんにちは!', subtitle: 'だれですか？', flag: '🇯🇵' },
];

const CYCLE_INTERVAL = 3500;

export default function LoginScreen() {
  const router = useRouter();
  const { setActiveUser } = useUser();

  // ── State ─────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // ── Animations ────────────────────────────────────────
  const titleAnim = useRef(new Animated.Value(0)).current;
  const [langIndex, setLangIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Load users from device storage on mount ───────────
  useEffect(() => {
    const loadUsers = async () => {
      // Run storage load and minimum timer in parallel
      // so the loading screen always shows for at least 2s
      const [raw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY).catch(() => null),
        new Promise((resolve) => setTimeout(resolve, LOADING_DURATION)),
      ]);
      try {
        if (raw) {
          setUsers(JSON.parse(raw));
        } else {
          setUsers(USERS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(USERS));
        }
      } catch {
        setUsers(USERS);
      } finally {
        setLoaded(true);
      }
    };
    loadUsers();
  }, []);

  // ── Save users to device storage ──────────────────────
  const saveUsers = useCallback(async (updated: User[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save users:', e);
    }
  }, []);

  // ── Entry spring ──────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    Animated.spring(titleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [loaded]);

  // ── Language cycle ────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setLangIndex((prev) => (prev + 1) % GREETINGS.length);
        slideAnim.setValue(16);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 70,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // ── Handlers ──────────────────────────────────────────
  const handleUserSelect = (user: User) => {
    setActiveUser(user);
    router.replace('/(tabs)/learn');
  };

  const handleAddKid = async (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    await saveUsers(updated);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    const updated = users.filter((u) => u.id !== userToDelete.id);
    setUsers(updated);
    await saveUsers(updated);
    setUserToDelete(null);
  };

  if (!loaded) return <LoadingScreen duration={LOADING_DURATION} />;

  const current = GREETINGS[langIndex];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* ── Background blobs ───────────────────────── */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ───────────────────────────────── */}
        <Animated.View
          style={[
            styles.titleWrapper,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <Text style={styles.titleEmoji}>{current.flag}</Text>
            <Text style={styles.title}>{current.greeting}</Text>
            <Text style={styles.subtitle}>{current.subtitle}</Text>
          </Animated.View>
        </Animated.View>

        {/* ── User grid ──────────────────────────────── */}
        <View style={styles.grid}>
          {users.map((user, index) => (
            <UserCard
              key={user.id}
              user={user}
              onPress={() => handleUserSelect(user)}
              onLongPress={() => setUserToDelete(user)}
              delay={index * 80}
            />
          ))}

          {/* ── Add kid card ───────────────────────── */}
          <TouchableOpacity
            onPress={() => setModalOpen(true)}
            activeOpacity={0.8}
          >
            <View
              style={[nStyles.addCard, { width: CARD_SIZE, height: CARD_SIZE }]}
            >
              <IconPlus
                stroke="#BBBBBB"
                size={CARD_SIZE * 0.35}
                strokeWidth={1.5}
              />
            </View>
            <View style={nStyles.addNameTag}>
              <Text style={nStyles.addNameText}>Nuevo niño</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Delete User Modal ─────────────────────────── */}
      <DeleteUserModal
        user={userToDelete}
        visible={userToDelete !== null}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Add Kid Modal ──────────────────────────────── */}
      <AddKidModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddKid}
      />
    </SafeAreaView>
  );
}
