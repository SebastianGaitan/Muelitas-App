// styles/games/crosswordStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const COLS = 9;
export const CELL_SIZE = Math.floor((SCREEN_W - 40) / COLS);

export const crosswordStyles = StyleSheet.create({
  // ── Preview button ─────────────────────────────
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  previewBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },

  // ── Fullscreen ─────────────────────────────────
  fullscreen: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },

  // ── Header ─────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFBF0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8D0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  exitBtn: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    padding: 6,
  },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  checkBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
  },

  // ── Grid ───────────────────────────────────────
  gridContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cellBlack: {
    backgroundColor: '#2D2D2D',
    borderColor: '#2D2D2D',
  },
  cellSelected: {
    backgroundColor: '#BDE0FF',
  },
  cellActive: {
    backgroundColor: '#4A90E2',
  },
  cellCorrect: {
    backgroundColor: '#C8F7C5',
  },
  cellWrong: {
    backgroundColor: '#FFD0D0',
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 2,
    fontSize: 8,
    fontWeight: '700',
    color: '#555',
    lineHeight: 9,
  },
  cellLetter: {
    fontSize: CELL_SIZE * 0.48,
    fontWeight: '900',
    color: '#2D2D2D',
    textAlign: 'center',
  },
  cellLetterActive: {
    color: '#fff',
  },

  // ── Clues ──────────────────────────────────────
  cluesScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cluesSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  cluesSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  clueRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  clueRowActive: {
    backgroundColor: '#EAF4FF',
  },
  clueNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4A90E2',
    minWidth: 24,
  },
  clueText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  clueTextActive: {
    color: '#2D2D2D',
    fontWeight: '700',
  },

  // ── Win overlay ────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  overlayEmoji: {
    fontSize: 72,
  },
  overlayTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D2D2D',
    textAlign: 'center',
  },
  overlaySubtitle: {
    fontSize: 15,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  overlayCoins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overlayCoinsText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F39C12',
  },
  playAgainBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  playAgainBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
});
