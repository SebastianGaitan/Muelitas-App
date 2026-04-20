// components/ui/FlashCard.tsx
import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { IconBulb, IconRotate, IconVolume } from '@tabler/icons-react-native';
import * as Speech from 'expo-speech';
import {
  flashCardStyles as s,
  CARD_WIDTH,
  CARD_HEIGHT,
} from '@/styles/screens/flashCardStyles';

type Props = {
  question: string;
  answer: string;
  color: string;
  borderColor: string;
  voiceId?: string;
};

export default function FlashCard({
  question,
  answer,
  color,
  borderColor,
  voiceId,
}: Props) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipToAnswer = () => {
    Animated.spring(flipAnim, {
      toValue: 1,
      tension: 60,
      friction: 10,
      useNativeDriver: false,
    }).start();
    setFlipped(true);
  };

  const flipToQuestion = () => {
    Animated.spring(flipAnim, {
      toValue: 0,
      tension: 60,
      friction: 10,
      useNativeDriver: false,
    }).start();
    setFlipped(false);
  };

  const handlePress = () => (flipped ? flipToQuestion() : flipToAnswer());

  const handleSpeak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'es-MX', pitch: 0.85, voice: voiceId });
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '90deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-90deg', '-90deg', '0deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5],
    outputRange: [1, 1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5],
    outputRange: [0, 0, 1],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handlePress}
      style={s.wrapper}
    >
      {/* ── Question face ─────────────────────────── */}
      <Animated.View
        style={[
          s.card,
          { backgroundColor: color, borderColor },
          { transform: [{ rotateY: frontRotate }], opacity: frontOpacity },
        ]}
      >
        <Text style={[s.questionText, { color: borderColor }]}>{question}</Text>

        <TouchableOpacity
          style={[s.speakerBtn, { backgroundColor: borderColor + '22', borderColor: borderColor + '55' }]}
          onPress={() => handleSpeak(question)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconVolume stroke={borderColor} size={18} strokeWidth={2} />
        </TouchableOpacity>

        <View style={[s.tapHint, { borderColor }]}>
          <IconBulb stroke={borderColor} size={14} strokeWidth={2} />
          <Text style={[s.tapHintText, { color: borderColor }]}>
            Toca para ver
          </Text>
        </View>
      </Animated.View>

      {/* ── Answer face ───────────────────────────── */}
      <Animated.View
        style={[
          s.card,
          s.cardBack,
          { backgroundColor: borderColor },
          { transform: [{ rotateY: backRotate }], opacity: backOpacity },
        ]}
      >
        <IconBulb stroke="rgba(255,255,255,0.8)" size={32} strokeWidth={1.5} />
        <Text style={s.answerText}>{answer}</Text>

        <TouchableOpacity
          style={s.speakerBtnBack}
          onPress={() => handleSpeak(answer)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconVolume stroke="rgba(255,255,255,0.9)" size={18} strokeWidth={2} />
        </TouchableOpacity>

        <View style={s.tapHintBack}>
          <IconRotate
            stroke="rgba(255,255,255,0.7)"
            size={14}
            strokeWidth={2}
          />
          <Text style={s.tapHintTextBack}>Toca para volver</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
