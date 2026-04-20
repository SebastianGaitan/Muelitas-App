// styles/screens/rewardsStyles.ts
import { StyleSheet } from 'react-native';

export const rewardsStyles = StyleSheet.create({
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

  // ── Reward card ────────────────────────────────
  rewardCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#FFFBF0',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rewardCardClaimed: {
    opacity: 0.55,
  },

  // ── Left emoji circle ──────────────────────────
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardEmoji: {
    fontSize: 32,
  },

  // ── Text block ────────────────────────────────
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D2D2D',
    marginBottom: 2,
  },
  rewardDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#AAAAAA',
    marginBottom: 8,
  },

  // ── Claim button ──────────────────────────────
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  claimBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  claimBtnDisabled: {
    backgroundColor: '#E0E0E0',
  },
  claimBtnTextDisabled: {
    color: '#BBBBBB',
  },

  // ── Claimed badge (replaces button) ───────────
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  claimedBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#AAAAAA',
  },

  // ── Locked badge (7-day cooldown) ─────────────
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  lockedBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AAAAAA',
  },

  // ── Section title ─────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D2D2D',
    marginHorizontal: 24,
    marginBottom: 12,
    marginTop: 4,
  },
});
