// styles/ui/coinsDisplayStyles.ts
import { StyleSheet } from 'react-native';

export const coinsDisplayStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F39C12',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coinCount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F39C12',
  },
});
