// components/ui/BrushTimer.tsx
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { IconCoin } from '@tabler/icons-react-native';
import { BrushSession } from '@/context/UserContext';
import { brushTimerStyles as s } from '@/styles/ui/brushTimerStyles';

const COINS_PER_BRUSH = 5;
const BONUS_ALL_THREE = 10;

type Props = {
  visible: boolean;
  session: BrushSession;
  sessionColor: string;
  sessionIcon: ReactElement;
  isBonus: boolean;
  onClose: () => void;
  onComplete: () => void;
};

type TimerState = 'idle' | 'playing' | 'done';

const SESSION_LABELS: Record<BrushSession, string> = {
  morning: 'Morning Brush',
  afternoon: 'Afternoon Brush',
  night: 'Night Brush',
};

export default function BrushTimer({
  visible,
  session,
  sessionColor,
  sessionIcon,
  isBonus,
  onClose,
  onComplete,
}: Props) {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [progress, setProgress] = useState(0);
  const [timeLabel, setTimeLabel] = useState('00:00 / 00:00');
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(
    require('../../assets/videos/plim-plim-cepillarnos.mp4'),
    (p) => {
      p.loop = false;
      p.pause();
    },
  );

  // ── Track playback progress ───────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!player) return;

      const pos = player.currentTime ?? 0;
      const dur = player.duration ?? 0;

      if (dur > 0) {
        const p = pos / dur;
        setProgress(p);
        Animated.timing(progressAnim, {
          toValue: p,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setTimeLabel(`${formatTime(pos)} / ${formatTime(dur)}`);
      }

      // Detect finish
      if (dur > 0 && pos >= dur - 0.5) {
        clearInterval(interval);
        setTimerState('done');
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player, timerState]);

  // ── Reset when modal opens/closes ─────────────────────
  useEffect(() => {
    if (visible) {
      setTimerState('idle');
      setProgress(0);
      progressAnim.setValue(0);
      scaleAnim.setValue(0);
      player.seekBy(-player.currentTime); // seek to 0
      player.pause();
    } else {
      player.pause();
    }
  }, [visible]);

  const handleStart = () => {
    setTimerState('playing');
    player.play();
  };

  const handleClose = () => {
    player.pause();
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
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

              {/* Video */}
              <View style={s.videoWrapper}>
                <VideoView
                  player={player}
                  style={s.video}
                  contentFit="cover"
                  nativeControls={false}
                />

                {/* Progress bar */}
                <View style={s.progressTrack}>
                  <Animated.View
                    style={[
                      s.progressFill,
                      { width: progressWidth, backgroundColor: sessionColor },
                    ]}
                  />
                </View>

                {/* Time label */}
                <View style={s.timeOverlay}>
                  <Text style={s.timeText}>{timeLabel}</Text>
                </View>
              </View>

              {timerState === 'idle' && (
                <TouchableOpacity
                  style={[s.startBtn, { backgroundColor: sessionColor }]}
                  onPress={handleStart}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>Start Brushing! 🦷</Text>
                </TouchableOpacity>
              )}

              {timerState === 'playing' && (
                <Text style={s.playingHint}>
                  Keep brushing along to the song!
                </Text>
              )}

              <TouchableOpacity style={s.cancelBtn} onPress={handleClose}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Animated.View
              style={[s.doneContainer, { transform: [{ scale: scaleAnim }] }]}
            >
              <Text style={s.doneEmoji}>🎉</Text>
              <Text style={s.doneTitle}>Great job!</Text>
              <Text style={s.doneSubtitle}>
                Your teeth are sparkling clean!
              </Text>
              <View style={s.coinsEarned}>
                <IconCoin stroke="#F39C12" size={24} strokeWidth={2} />
                <Text style={s.coinsEarnedText}>
                  +{coinsEarned} coins{isBonus ? ' (bonus! 🎊)' : ''}
                </Text>
              </View>
              <TouchableOpacity
                style={s.doneBtn}
                onPress={onComplete}
                activeOpacity={0.85}
              >
                <Text style={s.doneBtnText}>Awesome! ✓</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}
