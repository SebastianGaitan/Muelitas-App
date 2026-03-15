// styles/screens/gamesStyles.ts
import { StyleSheet } from 'react-native';

export const gamesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  scrollContent: {
    paddingBottom: 32,
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
  },

  // ── Game card ──────────────────────────────────
  gameCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFBF0',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#AAAAAA',
    marginBottom: 12,
  },
});
