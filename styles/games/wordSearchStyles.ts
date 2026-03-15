// styles/games/wordSearchStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');
export const GRID_COLS = 12;
export const CELL_SIZE = Math.floor((SCREEN_W - 8) / GRID_COLS);

export const wordSearchStyles = StyleSheet.create({
  // ── Preview button ─────────────────────────────
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#FFFBF0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8D0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  exitBtn: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 20,
    padding: 6,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF3DC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F39C12',
  },

  // ── Grid ───────────────────────────────────────
  gridWrapper: {
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 4,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  cellHighlight: {
    backgroundColor: 'rgba(74,144,226,0.25)',
  },
  cellFound: {
    backgroundColor: '#C8F7C5',
  },
  cellSelecting: {
    backgroundColor: 'rgba(74,144,226,0.5)',
  },
  cellLetter: {
    fontSize: CELL_SIZE * 0.52,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  cellLetterFound: {
    color: '#27AE60',
    fontWeight: '900',
  },

  // ── Word list ──────────────────────────────────
  wordList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  wordListTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  wordChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  wordChipFound: {
    backgroundColor: '#C8F7C5',
  },
  wordChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
  },
  wordChipTextFound: {
    color: '#27AE60',
    textDecorationLine: 'line-through',
  },

  // ── Clue bar ───────────────────────────────────
  clueBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F4E8',
    borderTopWidth: 1,
    borderTopColor: '#EDE4CC',
    minHeight: 40,
  },
  clueText: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // ── Win overlay ────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,251,240,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
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
  exitOverlayBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 4,
  },
  exitOverlayBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
});
