// styles/deleteUserStyles.ts
import { StyleSheet } from 'react-native';

export const deleteUserStyles = StyleSheet.create({
  // ── Overlay ────────────────────────────────────
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 32,
  },

  // ── Card ───────────────────────────────────────
  card: {
    backgroundColor: '#FFFBF0',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },

  // ── Avatar preview ─────────────────────────────
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 38,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  // ── Text ───────────────────────────────────────
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2D2D2D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  nameHighlight: {
    fontWeight: '800',
    color: '#2D2D2D',
  },

  // ── Buttons ────────────────────────────────────
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#888',
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FF4D6D',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
