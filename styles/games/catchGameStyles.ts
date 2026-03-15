// styles/games/catchGameStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const CHARACTER_W = 48;
export const CHARACTER_H = 48;
export const CATCH_TOLERANCE = 24;

export const catchGameStyles = StyleSheet.create({
  // ── Preview button (shown in games screen) ─────
  previewBtn: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 20,
    alignItems: 'center',
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
    backgroundColor: '#E8F4FF',
  },

  // ── HUD ────────────────────────────────────────
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  hudLives: {
    flexDirection: 'row',
    gap: 2,
  },
  hudLifeIcon: {
    fontSize: 18,
  },
  hudTimer: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  hudTimerWarning: {
    color: '#E74C3C',
  },
  hudScore: {
    fontSize: 16,
    fontWeight: '900',
    color: '#27AE60',
  },
  exitBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
    padding: 6,
  },

  // ── Board ──────────────────────────────────────
  board: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  // ── Items ──────────────────────────────────────
  item: {
    position: 'absolute',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSprite: {
    width: 32,
    height: 32,
  },

  // ── Character ──────────────────────────────────
  character: {
    position: 'absolute',
    bottom: 16,
    width: CHARACTER_W,
    height: CHARACTER_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 40,
  },

  // ── Score flash ────────────────────────────────
  scoreFlash: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: '900',
  },

  // ── Controls ───────────────────────────────────
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnText: {
    fontSize: 28,
    fontWeight: '900',
  },

  // ── Overlays ───────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.93)',
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
    fontWeight: '500',
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
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
  startBtn: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 20,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
});
