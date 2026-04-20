// app/(tabs)/learn.tsx
import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  IconBook,
  IconDental,
  IconApple,
  IconBuildingHospital,
  IconArrowLeft,
  IconArrowRight,
  IconLogout,
  IconMicrophone,
  IconCheck,
  IconX,
} from '@tabler/icons-react-native';
import FlashCard from '@/components/ui/FlashCard';
import CoinsDisplay from '@/components/ui/CoinsDisplay';
import { useUser } from '@/context/UserContext';
import IconToothbrush from '@/assets/icons/IconToothBrush';
import IconFloss from '@/assets/icons/IconFloss';
import { useRouter } from 'expo-router';
import { learnStyles as s } from '@/styles/screens/learnStyles';
import questionsData from '@/assets/data/questions.json';

type Card = {
  id: string;
  question: string;
  answer: string;
  emoji: string;
};

type Category = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  borderColor: string;
  cards: Card[];
};

// Map category id → Tabler icon
const CATEGORY_ICONS: Record<string, (color: string) => ReactElement> = {
  basics: (color) => <IconToothbrush stroke={color} size={18} />,
  flossing: (color) => <IconFloss stroke={color} size={18} />,
  teeth: (color) => <IconDental stroke={color} size={18} strokeWidth={2} />,
  food: (color) => <IconApple stroke={color} size={18} strokeWidth={2} />,
  dentist: (color) => (
    <IconBuildingHospital stroke={color} size={18} strokeWidth={2} />
  ),
};

export default function LearnScreen() {
  const { activeUser, logout } = useUser();
  const router = useRouter();
  const categories: Category[] = questionsData.categories;
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [cardIndex, setCardIndex] = useState(0);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Speech.Voice | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);

  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((all) => {
      const spanish = all.filter((v) => v.language.startsWith('es'));
      setVoices(spanish);
    });
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCategoryId)!;
  const totalCards = activeCategory.cards.length;
  const currentCard = activeCategory.cards[cardIndex];

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    setCardIndex(0);
  };

  const handlePrev = () => {
    if (cardIndex > 0) setCardIndex(cardIndex - 1);
  };

  const handleNext = () => {
    if (cardIndex < totalCards - 1) setCardIndex(cardIndex + 1);
  };

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom', 'left', 'right']}>
      {/* ── Header ───────────────────────────────────── */}
      <View style={s.header}>
        <View style={s.headerTopRow}>
          <View style={s.headerRow}>
            <IconBook stroke="#2D2D2D" size={28} strokeWidth={2.5} />
            <Text style={s.headerTitle}>Aprender</Text>
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
        <Text style={s.headerSubtitle}>¡Toca una tarjeta para ver la respuesta!</Text>
      </View>

      {/* ── Category tabs ────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsContainer}
        style={s.tabsScroll}
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          const iconColor = isActive ? '#fff' : cat.borderColor;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleCategoryChange(cat.id)}
              activeOpacity={0.8}
              style={[
                s.tab,
                { borderColor: cat.borderColor },
                isActive && { backgroundColor: cat.borderColor },
              ]}
            >
              {CATEGORY_ICONS[cat.id]?.(iconColor)}
              <Text style={[s.tabText, isActive && s.tabTextActive]}>
                {cat.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Card area ────────────────────────────────── */}
      <View style={s.cardArea}>
        {/* Counter row */}
        <View style={s.counterRow}>
          <Text style={s.counter}>
            {cardIndex + 1} / {totalCards}
          </Text>
          <TouchableOpacity
            style={[s.voiceBtn, { borderColor: activeCategory.borderColor + '66' }]}
            onPress={() => setShowVoicePicker(true)}
            activeOpacity={0.7}
          >
            <IconMicrophone stroke={activeCategory.borderColor} size={13} strokeWidth={2.5} />
            <Text style={[s.voiceBtnText, { color: activeCategory.borderColor }]} numberOfLines={1}>
              {selectedVoice ? selectedVoice.name : 'Voz auto'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Flash card — key forces remount on card change so it resets flip */}
        <FlashCard
          key={`${activeCategoryId}-${cardIndex}`}
          question={currentCard.question}
          answer={currentCard.answer}
          color={activeCategory.color}
          borderColor={activeCategory.borderColor}
          voiceId={selectedVoice?.identifier}
        />

        {/* Progress dots */}
        <View style={s.dotsRow}>
          {activeCategory.cards.map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                {
                  backgroundColor:
                    i === cardIndex ? activeCategory.borderColor : '#E0E0E0',
                  width: i === cardIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Prev / Next buttons */}
        <View style={s.navRow}>
          <TouchableOpacity
            onPress={handlePrev}
            activeOpacity={0.8}
            disabled={cardIndex === 0}
            style={[
              s.navBtn,
              { borderColor: activeCategory.borderColor },
              cardIndex === 0 && s.navBtnDisabled,
            ]}
          >
            <IconArrowLeft
              stroke={cardIndex === 0 ? '#CCCCCC' : activeCategory.borderColor}
              size={20}
              strokeWidth={2.5}
            />
            <Text
              style={[
                s.navBtnText,
                { color: activeCategory.borderColor },
                cardIndex === 0 && s.navBtnTextDisabled,
              ]}
            >
              Anterior
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            disabled={cardIndex === totalCards - 1}
            style={[
              s.navBtn,
              {
                backgroundColor: activeCategory.borderColor,
                borderColor: activeCategory.borderColor,
              },
              cardIndex === totalCards - 1 && s.navBtnDisabled,
            ]}
          >
            <Text
              style={[
                s.navBtnText,
                s.navBtnNextText,
                cardIndex === totalCards - 1 && s.navBtnTextDisabled,
              ]}
            >
              Siguiente
            </Text>
            <IconArrowRight
              stroke={cardIndex === totalCards - 1 ? '#CCCCCC' : '#fff'}
              size={20}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* ── Voice picker modal ───────────────────────── */}
      <Modal
        visible={showVoicePicker}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowVoicePicker(false)}
      >
        <TouchableOpacity
          style={s.pickerBackdrop}
          activeOpacity={1}
          onPress={() => setShowVoicePicker(false)}
        />
        <View style={s.pickerSheet}>
          <View style={s.pickerHandle} />
          <View style={s.pickerHeader}>
            <Text style={s.pickerTitle}>Selecciona una voz</Text>
            <TouchableOpacity onPress={() => setShowVoicePicker(false)}>
              <IconX stroke="#999" size={20} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={[{ identifier: '', name: 'Automática', language: '', quality: '' } as Speech.Voice, ...voices]}
            keyExtractor={(item) => item.identifier || 'auto'}
            style={s.pickerList}
            renderItem={({ item }) => {
              const isAuto = item.identifier === '';
              const isSelected = isAuto ? selectedVoice === null : selectedVoice?.identifier === item.identifier;
              return (
                <TouchableOpacity
                  style={[s.pickerItem, isSelected && { backgroundColor: activeCategory.borderColor + '18' }]}
                  onPress={() => {
                    setSelectedVoice(isAuto ? null : item);
                    setShowVoicePicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={s.pickerItemLeft}>
                    <Text style={[s.pickerItemName, isSelected && { color: activeCategory.borderColor }]}>
                      {item.name}
                    </Text>
                    {!isAuto && (
                      <Text style={s.pickerItemMeta}>{item.language}{item.quality ? ` · ${item.quality}` : ''}</Text>
                    )}
                  </View>
                  {isSelected && (
                    <IconCheck stroke={activeCategory.borderColor} size={18} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
