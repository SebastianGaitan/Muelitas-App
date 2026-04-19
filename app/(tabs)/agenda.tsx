// app/(tabs)/brush.tsx
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  IconSunrise,
  IconSun,
  IconMoon,
  IconCheck,
  IconCoin,
  IconCalendar,
  IconLogout,
} from '@tabler/icons-react-native';
import { useUser, BrushSession, todayKey } from '@/context/UserContext';
import { useVideoPlayer } from 'expo-video';
import CoinsDisplay from '@/components/ui/CoinsDisplay';
import BrushTimer from '@/components/ui/BrushTimer';
import BrushCalendar from '@/components/ui/BrushCalendar';
import { brushStyles as s } from '@/styles/screens/brushStyles';

// ── Session config ────────────────────────────────────
const SESSIONS: {
  id: BrushSession;
  label: string;
  sublabel: string;
  color: string;
  icon: (color: string) => ReactElement;
}[] = [
  {
    id: 'morning',
    label: 'Morning',
    sublabel: 'Start your day fresh!',
    color: '#F39C12',
    icon: (c) => <IconSunrise stroke={c} size={24} strokeWidth={2} />,
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    sublabel: 'Keep it clean after lunch!',
    color: '#4A90E2',
    icon: (c) => <IconSun stroke={c} size={24} strokeWidth={2} />,
  },
  {
    id: 'night',
    label: 'Night',
    sublabel: 'Goodnight, clean teeth!',
    color: '#9B59B6',
    icon: (c) => <IconMoon stroke={c} size={24} strokeWidth={2} />,
  },
];

type CalendarMode = 'weekly' | 'monthly';

export default function BrushScreen() {
  const { activeUser, brushLog, logBrush, loadBrushLog, logout } = useUser();
  const router = useRouter();

  // Preload video at screen level so Android has time to load metadata
  const brushPlayer = useVideoPlayer(
    require('../../assets/videos/plim-plim-cepillarnos.mp4'),
    (p) => {
      p.loop = false;
      p.pause();
    },
  );

  const [calendarMode, setCalendarMode] = useState<CalendarMode>('weekly');
  const [activeSession, setActiveSession] = useState<BrushSession | null>(null);
  const [timerVisible, setTimerVisible] = useState(false);

  // Load this user's brush log when screen mounts
  useEffect(() => {
    loadBrushLog();
  }, [activeUser]);

  const todayLog = brushLog[todayKey()] ?? {
    morning: false,
    afternoon: false,
    night: false,
  };
  const doneTodayCount = [
    todayLog.morning,
    todayLog.afternoon,
    todayLog.night,
  ].filter(Boolean).length;

  // This brush will be the 3rd = bonus coins
  const isBonus = (session: BrushSession) =>
    doneTodayCount === 2 && !todayLog[session];

  const handleSessionPress = (session: BrushSession) => {
    if (todayLog[session]) return; // already done, locked
    setActiveSession(session);
    setTimerVisible(true);
  };

  const handleTimerComplete = async () => {
    if (!activeSession) return;
    await logBrush(activeSession);
    setTimerVisible(false);
    setActiveSession(null);
  };

  const activeSessionConfig = SESSIONS.find(
    (sess) => sess.id === activeSession,
  );
  const accentColor = activeUser?.borderColor ?? '#FF6B9D';

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ─────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerTopRow}>
            <View style={s.headerRow}>
              <IconCalendar stroke="#2D2D2D" size={28} strokeWidth={2.5} />
              <Text style={s.headerTitle}>Agenda</Text>
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
          <Text style={s.headerSubtitle}>
            {doneTodayCount === 3
              ? 'Amazing! All done for today! 🌟'
              : `${doneTodayCount}/3 sessions done today`}
          </Text>
        </View>

        {/* ── Today's sessions ───────────────────────── */}
        <View style={s.sessionsWrapper}>
          <Text style={s.sectionTitle}>Today's Sessions</Text>
          {SESSIONS.map((session) => {
            const done = todayLog[session.id];
            const color = done ? '#CCCCCC' : session.color;
            const bgColor = done ? '#F5F5F5' : session.color + '15';
            const borderColor = done ? '#E0E0E0' : session.color + '55';

            return (
              <TouchableOpacity
                key={session.id}
                activeOpacity={done ? 1 : 0.8}
                onPress={() => handleSessionPress(session.id)}
                style={[
                  s.sessionCard,
                  { backgroundColor: bgColor, borderColor },
                ]}
              >
                <View style={s.sessionLeft}>
                  {session.icon(color)}
                  <View>
                    <Text style={[s.sessionLabel, { color }]}>
                      {session.label}
                    </Text>
                    <Text
                      style={[
                        s.sessionSublabel,
                        { color: done ? '#CCCCCC' : color + 'BB' },
                      ]}
                    >
                      {done ? 'Done for today!' : session.sublabel}
                    </Text>
                  </View>
                </View>

                {/* Right badge */}
                <View
                  style={[
                    s.sessionBadge,
                    { backgroundColor: done ? '#E0E0E0' : session.color },
                  ]}
                >
                  {done ? (
                    <IconCheck stroke="#fff" size={16} strokeWidth={2.5} />
                  ) : (
                    <IconCoin stroke="#fff" size={16} strokeWidth={2} />
                  )}
                  <Text style={[s.sessionBadgeText, { color: '#fff' }]}>
                    {done ? 'Done' : '+5'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Calendar toggle ────────────────────────── */}
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tabBtn, calendarMode === 'weekly' && s.tabBtnActive]}
            onPress={() => setCalendarMode('weekly')}
          >
            <Text
              style={[
                s.tabBtnText,
                calendarMode === 'weekly' && s.tabBtnTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tabBtn, calendarMode === 'monthly' && s.tabBtnActive]}
            onPress={() => setCalendarMode('monthly')}
          >
            <Text
              style={[
                s.tabBtnText,
                calendarMode === 'monthly' && s.tabBtnTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Calendar ───────────────────────────────── */}
        <BrushCalendar
          brushLog={brushLog}
          accentColor={accentColor}
          mode={calendarMode}
        />
      </ScrollView>

      {/* ── Timer modal ────────────────────────────────── */}
      {activeSession && activeSessionConfig && (
        <BrushTimer
          player={brushPlayer}
          visible={timerVisible}
          session={activeSession}
          sessionColor={activeSessionConfig.color}
          sessionIcon={activeSessionConfig.icon(activeSessionConfig.color)}
          isBonus={isBonus(activeSession)}
          onClose={() => {
            setTimerVisible(false);
            setActiveSession(null);
          }}
          onComplete={handleTimerComplete}
        />
      )}
    </SafeAreaView>
  );
}
