// styles/flashCardStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width - 48;
export const CARD_HEIGHT = CARD_WIDTH * 0.65;

export const flashCardStyles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    borderWidth: 3,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 0,
  },

  questionText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
  },
  answerText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 25,
  },
  tapHint: {
    position: 'absolute',
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tapHintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tapHintBack: {
    position: 'absolute',
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tapHintTextBack: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  speakerBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerBtnBack: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
