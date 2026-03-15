// styles/newUserStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const newUserStyles = StyleSheet.create({
  // ── Add card (dashed placeholder) ─────────────
  addCard: {
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  addNameTag: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
  },
  addNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // ── Backdrop ───────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 10,
  },

  // ── Sheet wrapper ──────────────────────────────
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  sheet: {
    backgroundColor: '#FFFBF0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },

  // ── Handle ─────────────────────────────────────
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  // ── Sheet header ───────────────────────────────
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
    paddingHorizontal: 24,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Label ──────────────────────────────────────
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // ── Text input ─────────────────────────────────
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 20,
  },

  // ── Color swatches ─────────────────────────────
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
  },
  colorSwatchSelected: {
    transform: [{ scale: 1.25 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // ── Camera button ──────────────────────────────
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 20,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: '#DDDDDD',
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cameraBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  retakeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  retakeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Or divider ─────────────────────────────────
  orText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#BBBBBB',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  // ── Emoji picker ───────────────────────────────
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 22,
  },

  // ── Create button ──────────────────────────────
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
  },
  createBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },

  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    marginTop: 8,
    paddingVertical: 8,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF4D6D',
  },
});
