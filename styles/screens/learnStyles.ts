// styles/learnStyles.ts
import { StyleSheet } from 'react-native';

export const learnStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },

  // ── Header ─────────────────────────────────────
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#AAAAAA',
    marginTop: 2,
  },

  // ── Category tabs ──────────────────────────────
  tabsScroll: {
    flexGrow: 0,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    gap: 10,
    paddingBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#AAAAAA',
  },
  tabTextActive: {
    color: '#fff',
  },

  // ── Card area ──────────────────────────────────
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  counter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CCCCCC',
    letterSpacing: 1,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
    maxWidth: 130,
  },
  voiceBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Progress dots ──────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // ── Nav buttons ────────────────────────────────
  navRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  navBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  navBtnDisabled: {
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  navBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  navBtnNextText: {
    color: '#fff',
  },
  navBtnTextDisabled: {
    color: '#CCCCCC',
  },

  // ── Voice picker ───────────────────────────────
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  pickerSheet: {
    backgroundColor: '#FFFBF0',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 32,
    maxHeight: '65%',
  },
  pickerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D2D2D',
  },
  pickerList: {
    paddingHorizontal: 16,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 4,
  },
  pickerItemLeft: {
    flex: 1,
    gap: 2,
  },
  pickerItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  pickerItemMeta: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '500',
  },
});
