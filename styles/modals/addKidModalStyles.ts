// styles/addKidModalStyles.ts
import { StyleSheet } from 'react-native';

export const addKidModalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFBF0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  // ScrollView fills all remaining space after handle + header
  scrollView: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
});
