import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import type { ButtonSize, ButtonVariant } from './button.types';

// Size styles
export const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  md: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  lg: {
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
};

export const iconOnlySizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    width: 32,
    height: 32,
    paddingHorizontal: 0,
  },
  md: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
  },
  lg: {
    width: 56,
    height: 56,
    paddingHorizontal: 0,
  },
};

// Label size styles
export const labelSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: {
    fontSize: 13,
    fontFamily: 'Pretendard-Medium',
  },
  md: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
  },
  lg: {
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
  },
};

// Variant colors (these will be used with theme)
export interface VariantColors {
  background: string;
  border: string;
  text: string;
  hoverBackground: string;
}

export const styleSheet = StyleSheet.create({
  buttonRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    flex: 1,
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  labelBase: {
    textAlign: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});

// Helper to get variant styles based on theme colors
export function getVariantStyles(
  variant: ButtonVariant,
  colors: {
    primary: string;
    primaryText: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    accent: string;
  },
): { container: ViewStyle; text: TextStyle; hoverColor: string } {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: colors.primary,
          borderWidth: 0,
        },
        text: {
          color: colors.primaryText,
        },
        hoverColor: colors.primary + '20',
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: colors.bgSecondary,
          borderWidth: 0,
        },
        text: {
          color: colors.textPrimary,
        },
        hoverColor: colors.border,
      };
    case 'tertiary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
        text: {
          color: colors.textSecondary,
        },
        hoverColor: colors.bgSecondary,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        },
        text: {
          color: colors.textPrimary,
        },
        hoverColor: colors.bgSecondary,
      };
    case 'danger':
      return {
        container: {
          backgroundColor: '#dc2626',
          borderWidth: 0,
        },
        text: {
          color: '#ffffff',
        },
        hoverColor: '#b91c1c',
      };
    case 'danger-soft':
      return {
        container: {
          backgroundColor: '#fef2f2',
          borderWidth: 0,
        },
        text: {
          color: '#dc2626',
        },
        hoverColor: '#fee2e2',
      };
    default:
      return {
        container: {
          backgroundColor: colors.primary,
          borderWidth: 0,
        },
        text: {
          color: colors.primaryText,
        },
        hoverColor: colors.primary + '20',
      };
  }
}
