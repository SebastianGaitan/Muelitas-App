// styles/ui/brushCalendarStyles.ts
import { StyleSheet } from 'react-native';

export const brushCalendarStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 24,
    marginBottom: 16,
  },

  // ── Weekly ─────────────────────────────────────
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    textTransform: 'uppercase',
  },
  dayBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  dayDate: {
    fontSize: 12,
    fontWeight: '800',
  },
  dotRow: {
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  // ── Monthly ────────────────────────────────────
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D2D2D',
  },
  monthNavBtn: {
    padding: 6,
  },
monthDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    marginBottom: 4,
  },
  monthCellWrapper: {
    flex: 1,
    paddingHorizontal: 2,
    marginBottom: 6,
  },
  monthCell: {
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthCellDate: {
    fontSize: 12,
    fontWeight: '700',
  },
});
