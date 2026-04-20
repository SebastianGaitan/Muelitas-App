// components/ui/BrushTimer.tsx
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { VideoPlayer, VideoView } from 'expo-video';
import { IconCoin } from '@tabler/icons-react-native';
import { BrushSession } from '@/context/UserContext';
import { brushTimerStyles as s } from '@/styles/ui/brushTimerStyles';

const COINS_PER_BRUSH = 5;
const BONUS_ALL_THREE = 10;

const VIDEO_DURATION_SECS = 164;

type Props = {
  visible: boolean;
  session: BrushSession;
  sessionColor: string;
  sessionIcon: ReactElement;
  isBonus: boolean;
  player: VideoPlayer;
  onClose: () => void;
  onComplete: () => void;
};

type TimerState = 'idle' | 'playing' | 'done';

const SESSION_LABELS: Record<BrushSession, string> = {
  morning: 'Cepillado de mañana',
  afternoon: 'Cepillado de tarde',
  night: 'Cepillado de noche',
};

export default function BrushTimer({
  visible,
  session,
  sessionColor,
  sessionIcon,
  isBonus,
  player,
  onClose,
  onComplete,
}: Props) {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearPoller = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const triggerDone = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    clearPoller();
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setTimerState('done');
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const startPoller = () => {
    clearPoller();
    startTimeRef.current = Date.now();
    let notPlayingCount = 0;

    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const pos = player.currentTime ?? 0;
        const dur = player.duration ?? 0;
        const playing = (player as any).playing ?? true;

        // Use real duration if available and sane (iOS), otherwise use hardcoded constant (Android)
        const totalDuration =
          dur > 0 && dur < 86400 ? dur : VIDEO_DURATION_SECS;

        const p = Math.min(pos / totalDuration, 0.98);
        Animated.timing(progressAnim, {
          toValue: p,
          duration: 200,
          useNativeDriver: false,
        }).start();

        // End detection: position-based (iOS) or debounced !playing (Android)
        if (dur > 0 && dur < 86400) {
          if (!doneRef.current && pos >= dur - 1.5) triggerDone();
        } else {
          if (!playing) {
            notPlayingCount++;
            if (!doneRef.current && notPlayingCount >= 3) triggerDone();
          } else {
            notPlayingCount = 0;
          }
        }
      }, 300);
    }, 800);
  };

  // ── Reset when modal opens/closes ─────────────────────
  useEffect(() => {
    if (visible) {
      clearPoller();
      setTimerState('idle');
      progressAnim.setValue(0);
      scaleAnim.setValue(0);
      doneRef.current = false;
      player.seekBy(-(player.currentTime ?? 0));
      player.pause();
    } else {
      clearPoller();
      player.pause();
    }
  }, [visible]);

  useEffect(() => {
    return () => clearPoller();
  }, []);

  const handleStart = () => {
    setTimerState('playing');
    player.play();
    startPoller();
  };

  const handleClose = () => {
    clearPoller();
    player.pause();
    onClose();
  };

  const coinsEarned = isBonus
    ? COINS_PER_BRUSH + BONUS_ALL_THREE
    : COINS_PER_BRUSH;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={s.overlay}>
        <View style={s.card}>
          {timerState !== 'done' ? (
            <>
              <View style={s.sessionLabelRow}>
                {sessionIcon}
                <Text style={[s.sessionLabel, { color: sessionColor }]}>
                  {SESSION_LABELS[session]}
                </Text>
              </View>

              <View style={s.videoWrapper}>
                <VideoView
                  player={player}
                  style={s.video}
                  contentFit="cover"
                  nativeControls={false}
                />
                <View style={s.progressTrack}>
                  <Animated.View
                    style={[
                      s.progressFill,
                      { width: progressWidth, backgroundColor: sessionColor },
                    ]}
                  />
                </View>
              </View>

              {timerState === 'idle' && (
                <TouchableOpacity
                  style={[s.startBtn, { backgroundColor: sessionColor }]}
                  onPress={handleStart}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>¡Empezar a cepillar! 🦷</Text>
                </TouchableOpacity>
              )}

              {timerState === 'playing' && (
                <Text style={s.playingHint}>
                  ¡Sigue cepillando con la canción!
                </Text>
              )}

              <TouchableOpacity style={s.cancelBtn} onPress={handleClose}>
                <Text style={s.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Animated.View
              style={[s.doneContainer, { transform: [{ scale: scaleAnim }] }]}
            >
              <Text style={s.doneEmoji}>🎉</Text>
              <Text style={s.doneTitle}>¡Muy bien!</Text>
              <Text style={s.doneSubtitle}>
                ¡Tus dientes están brillantes!
              </Text>
              <View style={s.coinsEarned}>
                <IconCoin stroke="#F39C12" size={24} strokeWidth={2} />
                <Text style={s.coinsEarnedText}>
                  +{coinsEarned} monedas{isBonus ? ' (¡bonus! 🎊)' : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={s.doneBtn}
                onPress={onComplete}
                activeOpacity={0.85}
              >
                <Text style={s.doneBtnText}>¡Genial! ✓</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}
