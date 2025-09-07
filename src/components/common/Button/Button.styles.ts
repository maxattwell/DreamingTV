import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../styles';

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    margin: spacing.xs,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  
  secondary: {
    backgroundColor: colors.secondary,
  },
  
  danger: {
    backgroundColor: colors.error,
  },
  
  // Sizes
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  
  // States
  disabled: {
    backgroundColor: colors.lightGray,
    opacity: 0.6,
  },
  
  loading: {
    opacity: 0.8,
  },
  
  // Text styles
  text: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  textSmall: {
    fontSize: typography.fontSize.sm,
  },
  
  textLarge: {
    fontSize: typography.fontSize.lg,
  },
  
  textDisabled: {
    color: colors.textDisabled,
  },
});