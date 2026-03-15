// components/DeleteUserModal.tsx
import { useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { IconTrash } from '@tabler/icons-react-native';
import { User } from '@/constants/users';
import { deleteUserStyles as s } from '@/styles/modals/deleteUserStyles';

type Props = {
  user: User | null; // the user to potentially delete
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteUserModal({
  user,
  visible,
  onCancel,
  onConfirm,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 70,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleCancel = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onCancel());
  };

  const handleConfirm = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onConfirm());
  };

  if (!user) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
      onShow={animateIn}
    >
      <View style={s.overlay}>
        <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }] }]}>
          {/* ── Avatar preview ──────────────────── */}
          <View
            style={[
              s.avatarCircle,
              { backgroundColor: user.color, borderColor: user.borderColor },
            ]}
          >
            {user.photo ? (
              <Image
                source={{ uri: user.photo }}
                style={s.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={s.avatarEmoji}>{user.emoji}</Text>
            )}
          </View>

          {/* ── Text ────────────────────────────── */}
          <Text style={s.title}>Remove profile?</Text>
          <Text style={s.subtitle}>
            Are you sure you want to delete{'\n'}
            <Text style={s.nameHighlight}>{user.name}</Text>
            {"'s profile? This can't be undone."}
          </Text>

          {/* ── Buttons ─────────────────────────── */}
          <View style={s.buttonRow}>
            <TouchableOpacity
              style={s.cancelBtn}
              activeOpacity={0.8}
              onPress={handleCancel}
            >
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.deleteBtn}
              activeOpacity={0.8}
              onPress={handleConfirm}
            >
              <IconTrash stroke="#fff" size={18} strokeWidth={2.5} />
              <Text style={s.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
