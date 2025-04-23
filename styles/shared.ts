import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  heading: {
    ...fonts.heading,
    fontSize: fonts.sizes.xxxl,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    ...fonts.subheading,
    fontSize: fonts.sizes.xl,
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...fonts.body,
    fontSize: fonts.sizes.md,
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary + '50',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    ...fonts.body,
    fontSize: fonts.sizes.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.secondary + '50',
    marginVertical: 16,
  },
  errorText: {
    ...fonts.body,
    fontSize: fonts.sizes.sm,
    color: colors.error,
    marginBottom: 16,
  },
  goldGradient: {
    borderRadius: 8,
    padding: 2,
  },
  goldContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.background,
  },
});