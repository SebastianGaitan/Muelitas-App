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
  counter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CCCCCC',
    letterSpacing: 1,
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
});
