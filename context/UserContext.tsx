// context/UserContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/constants/users';

const STORAGE_KEY = 'muelitas:users';
const BRUSH_KEY_PREFIX = 'muelitas:brush:';

export type BrushSession = 'morning' | 'afternoon' | 'night';

export type DayLog = {
  morning: boolean;
  afternoon: boolean;
  night: boolean;
};

export type BrushLog = Record<string, DayLog>; // key = "YYYY-MM-DD"

// ── Coins rewarded per session ─────────────────────────
const COINS_PER_BRUSH = 5;
const BONUS_ALL_THREE = 10;

// ── Date helpers ──────────────────────────────────────
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type UserContextType = {
  activeUser: User | null;
  brushLog: BrushLog;
  setActiveUser: (user: User) => void;
  addCoins: (amount: number) => Promise<void>;
  logBrush: (session: BrushSession) => Promise<void>;
  loadBrushLog: () => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  activeUser: null,
  brushLog: {},
  setActiveUser: () => {},
  addCoins: async () => {},
  logBrush: async () => {},
  loadBrushLog: async () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUserState] = useState<User | null>(null);
  const [brushLog, setBrushLog] = useState<BrushLog>({});

  const setActiveUser = useCallback((user: User) => {
    setActiveUserState({ ...user, coins: user.coins ?? 0 });
  }, []);

  const logout = useCallback(() => {
    setActiveUserState(null);
    setBrushLog({});
  }, []);

  const loadBrushLog = useCallback(async () => {
    if (!activeUser) return;
    try {
      const raw = await AsyncStorage.getItem(BRUSH_KEY_PREFIX + activeUser.id);
      setBrushLog(raw ? JSON.parse(raw) : {});
    } catch {
      setBrushLog({});
    }
  }, [activeUser]);

  // ── Persist coins to all-users list ───────────────────
  const addCoins = useCallback(
    async (amount: number) => {
      if (!activeUser) return;
      const updatedUser = {
        ...activeUser,
        coins: (activeUser.coins ?? 0) + amount,
      };
      setActiveUserState(updatedUser);
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const users: User[] = JSON.parse(raw);
          const updated = users.map((u) =>
            u.id === activeUser.id
              ? updatedUser
              : { ...u, coins: u.coins ?? 0 },
          );
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (e) {
        console.warn('Failed to save coins:', e);
      }
    },
    [activeUser],
  );

  // ── Log a brush session ───────────────────────────────
  const logBrush = useCallback(
    async (session: BrushSession) => {
      if (!activeUser) return;

      const key = todayKey();
      const today = brushLog[key] ?? {
        morning: false,
        afternoon: false,
        night: false,
      };

      // Already done this session
      if (today[session]) return;

      const updated: DayLog = { ...today, [session]: true };
      const newLog: BrushLog = { ...brushLog, [key]: updated };

      setBrushLog(newLog);

      // Persist brush log
      try {
        await AsyncStorage.setItem(
          BRUSH_KEY_PREFIX + activeUser.id,
          JSON.stringify(newLog),
        );
      } catch (e) {
        console.warn('Failed to save brush log:', e);
      }

      // Award coins — bonus if all 3 done today
      const allThree = updated.morning && updated.afternoon && updated.night;
      const earned = allThree
        ? COINS_PER_BRUSH + BONUS_ALL_THREE // bonus on the last one
        : COINS_PER_BRUSH;

      await addCoins(earned);
    },
    [activeUser, brushLog, addCoins],
  );

  return (
    <UserContext.Provider
      value={{
        activeUser,
        brushLog,
        setActiveUser,
        addCoins,
        logBrush,
        loadBrushLog,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
