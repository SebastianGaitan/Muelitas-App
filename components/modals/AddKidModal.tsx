// components/AddKidModal.tsx
import { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import {
  IconX,
  IconCheck,
  IconCamera,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { User } from '@/constants/users';
import { newUserStyles as nStyles } from '@/styles/modals/newUserStyles';
import { addKidModalStyles as s } from '@/styles/modals/addKidModalStyles';

// ── Constants ─────────────────────────────────────────
const COLOR_OPTIONS = [
  { color: '#FFB3C6', borderColor: '#FF6B9D' },
  { color: '#B3D9FF', borderColor: '#4A90E2' },
  { color: '#C8F7C5', borderColor: '#27AE60' },
  { color: '#FFE5B3', borderColor: '#F39C12' },
  { color: '#E8B3FF', borderColor: '#9B59B6' },
  { color: '#B3FFF0', borderColor: '#1ABC9C' },
];

const EMOJI_OPTIONS = [
  '🌟',
  '🦋',
  '🐶',
  '🐱',
  '🦊',
  '🐸',
  '🚀',
  '🎨',
  '⚡',
  '🌈',
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
};

export default function AddKidModal({ visible, onClose, onAdd }: Props) {
  // ── Form state ────────────────────────────────────────
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // ── Sheet slide animation ─────────────────────────────
  const sheetAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.spring(sheetAnim, {
      toValue: 1,
      tension: 60,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [700, 0],
  });

  // ── Reset & close ─────────────────────────────────────
  const resetForm = () => {
    setName('');
    setSelectedColor(0);
    setSelectedEmoji(0);
    setPhotoUri(null);
    sheetAnim.setValue(0);
  };

  const handleClose = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start(() => {
      resetForm();
      onClose();
    });
  };

  // ── Camera ────────────────────────────────────────────
  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is needed to take a photo!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const avatarsDir = new Directory(Paths.document, 'avatars');
      if (!avatarsDir.exists) avatarsDir.create();
      const destFile = new File(avatarsDir, `avatar_${Date.now()}.jpg`);
      new File(result.assets[0].uri).copy(destFile);
      setPhotoUri(destFile.uri);
    }
  };

  // ── Create user ───────────────────────────────────────
  const handleCreate = () => {
    if (!name.trim()) return;
    const palette = COLOR_OPTIONS[selectedColor];
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      color: palette.color,
      borderColor: palette.borderColor,
      emoji: EMOJI_OPTIONS[selectedEmoji],
      ...(photoUri ? { photo: photoUri } : {}),
    };
    onAdd(newUser);
    handleClose();
  };

  const palette = COLOR_OPTIONS[selectedColor];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
      onShow={animateIn}
    >
      {/* Plain View — no SafeAreaView so nothing eats into the sheet */}
      <View style={s.safeArea}>
        {/* Backdrop */}
        <TouchableOpacity
          style={s.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Sheet */}
        <Animated.View
          style={[s.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        >
          {/* Handle */}
          <View style={nStyles.handle} />

          {/* Header */}
          <View style={nStyles.sheetHeader}>
            <Text style={nStyles.sheetTitle}>New Kid 🎉</Text>
            <TouchableOpacity onPress={handleClose} style={nStyles.closeBtn}>
              <IconX stroke="#999" size={20} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Scrollable form */}
          <ScrollView
            style={s.scrollView}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.formContent}
          >
            {/* Name */}
            <Text style={nStyles.label}>Name</Text>
            <TextInput
              style={nStyles.input}
              placeholder="Enter name..."
              placeholderTextColor="#CCC"
              value={name}
              onChangeText={setName}
              maxLength={12}
            />

            {/* Color */}
            <Text style={nStyles.label}>Color</Text>
            <View style={nStyles.colorRow}>
              {COLOR_OPTIONS.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedColor(i)}
                  style={[
                    nStyles.colorSwatch,
                    {
                      backgroundColor: opt.color,
                      borderColor: opt.borderColor,
                    },
                    i === selectedColor && nStyles.colorSwatchSelected,
                  ]}
                />
              ))}
            </View>

            {/* Avatar */}
            <Text style={nStyles.label}>Avatar</Text>

            <TouchableOpacity
              onPress={handleOpenCamera}
              activeOpacity={0.85}
              style={[
                nStyles.cameraBtn,
                photoUri
                  ? {
                      borderColor: palette.borderColor,
                      borderStyle: 'solid',
                      aspectRatio: 1,
                      width: '60%',
                      alignSelf: 'center',
                    }
                  : { width: '100%', height: 72 },
              ]}
            >
              {photoUri ? (
                <>
                  <Image
                    source={{ uri: photoUri }}
                    style={nStyles.cameraPreview}
                  />
                  <View style={nStyles.retakeOverlay}>
                    <IconRefresh stroke="#fff" size={18} strokeWidth={2} />
                    <Text style={nStyles.retakeText}>Retake</Text>
                  </View>
                </>
              ) : (
                <>
                  <IconCamera
                    stroke={palette.borderColor}
                    size={28}
                    strokeWidth={1.5}
                  />
                  <Text
                    style={[
                      nStyles.cameraBtnText,
                      { color: palette.borderColor },
                    ]}
                  >
                    Take a photo
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Remove photo button — only shown when photo is taken */}
            {photoUri && (
              <TouchableOpacity
                onPress={() => setPhotoUri(null)}
                style={nStyles.removePhotoBtn}
                activeOpacity={0.8}
              >
                <IconTrash stroke="#FF4D6D" size={16} strokeWidth={2} />
                <Text style={nStyles.removePhotoText}>
                  Remove photo & use emoji instead
                </Text>
              </TouchableOpacity>
            )}

            {/* Emoji — hidden if photo taken */}
            {!photoUri && (
              <>
                <Text style={nStyles.orText}>— or pick an emoji —</Text>
                <View style={nStyles.emojiRow}>
                  {EMOJI_OPTIONS.map((em, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setSelectedEmoji(i)}
                      style={[
                        nStyles.emojiBtn,
                        i === selectedEmoji && {
                          backgroundColor: palette.color,
                          borderColor: palette.borderColor,
                        },
                      ]}
                    >
                      <Text style={nStyles.emojiText}>{em}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Confirm */}
            <TouchableOpacity
              onPress={handleCreate}
              activeOpacity={0.85}
              style={[
                nStyles.createBtn,
                { backgroundColor: name.trim() ? palette.borderColor : '#DDD' },
              ]}
            >
              <IconCheck stroke="#fff" size={20} strokeWidth={2.5} />
              <Text style={nStyles.createBtnText}>Add Kid</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
