// styles/loginStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const CARD_SIZE = (width - 80) / 2;

export const loginStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  // ── Background blobs ──────────────────────────
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  blob1: {
    width: 280,
    height: 280,
    backgroundColor: '#FFB3C6',
    top: -80,
    left: -80,
  },
  blob2: {
    width: 220,
    height: 220,
    backgroundColor: '#B3D9FF',
    bottom: 60,
    right: -60,
  },
  blob3: {
    width: 160,
    height: 160,
    backgroundColor: '#C8F7C5',
    top: height * 0.4,
    left: -40,
  },

  // ── Title ─────────────────────────────────────
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleEmoji: {
    fontSize: 52,
    marginBottom: 4,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#2D2D2D',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#888',
    marginTop: 4,
    letterSpacing: 0.5,
  },

  // ── Grid ──────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
});

export const cardStyles = StyleSheet.create({
  // ── Wrapper ───────────────────────────────────
  cardWrapper: {
    alignItems: 'center',
  },

  // ── Square card ───────────────────────────────
  card: {
    borderRadius: 24,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  emoji: {
    fontSize: CARD_SIZE * 0.42,
  },

  // ── Corner dots ───────────────────────────────
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.6,
  },
  dotTL: { top: 10, left: 10 },
  dotTR: { top: 10, right: 10 },
  dotBL: { bottom: 10, left: 10 },
  dotBR: { bottom: 10, right: 10 },

  // ── Name tag ──────────────────────────────────
  nameTag: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
