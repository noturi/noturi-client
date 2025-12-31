import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger'
  | 'danger-soft';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type PressableFeedbackVariant = 'highlight' | 'ripple' | 'none';

export interface ButtonRootProps extends Omit<PressableProps, 'style'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  pressableFeedbackVariant?: PressableFeedbackVariant;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export interface ButtonLabelProps {
  children?: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

export interface ButtonIconProps {
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  position?: 'left' | 'right';
}

export interface ButtonContextValue {
  size: ButtonSize;
  variant: ButtonVariant;
  isDisabled: boolean;
}
