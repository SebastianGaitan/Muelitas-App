// styles/ui/brushTimerStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const brushTimerStyles = StyleSheet.create({
  // ── Overlay ────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFBF0',
    borderRadius: 32,
    padding: 28,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
    gap: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },

  // ── Session label ──────────────────────────────
  sessionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionLabel: {
    fontSize: 20,
    fontWeight: '900',
  },

  // ── Video ──────────────────────────────────────
  videoWrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: (width - 48 - 56) * 0.56, // 16:9ish
  },

  // ── Progress bar (sits at bottom of video) ─────
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },

  // ── Time overlay ───────────────────────────────
  timeOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Buttons ────────────────────────────────────
  startBtn: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  playingHint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AAAAAA',
    textAlign: 'center',
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#AAAAAA',
  },

  // ── Done state ─────────────────────────────────
  doneContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  doneEmoji: {
    fontSize: 64,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  doneSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#AAAAAA',
    textAlign: 'center',
  },
  coinsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinsEarnedText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F39C12',
  },
  doneBtn: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#27AE60',
  },
  doneBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
});
