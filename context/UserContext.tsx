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
const CLAIMS_KEY_PREFIX = 'muelitas:claims:';

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
  claimedRewards: Record<string, number>;
  setActiveUser: (user: User) => void;
  addCoins: (amount: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  claimReward: (rewardId: string, cost: number) => Promise<boolean>;
  logBrush: (session: BrushSession) => Promise<void>;
  loadBrushLog: () => Promise<void>;
  loadClaimedRewards: () => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  activeUser: null,
  brushLog: {},
  claimedRewards: {},
  setActiveUser: () => {},
  addCoins: async () => {},
  spendCoins: async () => false,
  claimReward: async () => false,
  logBrush: async () => {},
  loadBrushLog: async () => {},
  loadClaimedRewards: async () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUserState] = useState<User | null>(null);
  const [brushLog, setBrushLog] = useState<BrushLog>({});
  const [claimedRewards, setClaimedRewards] = useState<Record<string, number>>({});

  const setActiveUser = useCallback((user: User) => {
    setActiveUserState({ ...user, coins: user.coins ?? 0 });
  }, []);

  const logout = useCallback(() => {
    setActiveUserState(null);
    setBrushLog({});
    setClaimedRewards({});
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

  const loadClaimedRewards = useCallback(async () => {
    if (!activeUser) return;
    try {
      const raw = await AsyncStorage.getItem(CLAIMS_KEY_PREFIX + activeUser.id);
      setClaimedRewards(raw ? JSON.parse(raw) : {});
    } catch {
      setClaimedRewards({});
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

  // ── Spend coins (returns false if insufficient) ───────
  const spendCoins = useCallback(
    async (amount: number): Promise<boolean> => {
      if (!activeUser) return false;
      if ((activeUser.coins ?? 0) < amount) return false;
      const updatedUser = {
        ...activeUser,
        coins: (activeUser.coins ?? 0) - amount,
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
      return true;
    },
    [activeUser],
  );

  // ── Claim a reward (spends coins + records timestamp) ─
  const claimReward = useCallback(
    async (rewardId: string, cost: number): Promise<boolean> => {
      if (!activeUser) return false;
      const success = await spendCoins(cost);
      if (!success) return false;
      const updated = { ...claimedRewards, [rewardId]: Date.now() };
      setClaimedRewards(updated);
      try {
        await AsyncStorage.setItem(
          CLAIMS_KEY_PREFIX + activeUser.id,
          JSON.stringify(updated),
        );
      } catch (e) {
        console.warn('Failed to save claimed rewards:', e);
      }
      return true;
    },
    [activeUser, claimedRewards, spendCoins],
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
        claimedRewards,
        setActiveUser,
        addCoins,
        spendCoins,
        claimReward,
        logBrush,
        loadBrushLog,
        loadClaimedRewards,
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
