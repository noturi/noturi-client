import { useUserTheme } from '~/application/providers/theme-provider';

import { createContext, forwardRef, useContext, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { PressableFeedback } from '../pressable-feedback';
import {
  getVariantStyles,
  iconOnlySizeStyles,
  labelSizeStyles,
  sizeStyles,
  styleSheet,
} from './button.styles';
import type {
  ButtonContextValue,
  ButtonIconProps,
  ButtonLabelProps,
  ButtonRootProps,
} from './button.types';

// Context
const ButtonContext = createContext<ButtonContextValue>({
  size: 'md',
  variant: 'primary',
  isDisabled: false,
});

const useButton = () => useContext(ButtonContext);

// Root Component
const ButtonRoot = forwardRef<View, ButtonRootProps>((props, ref) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    isIconOnly = false,
    isDisabled = false,
    isLoading = false,
    fullWidth = false,
    pressableFeedbackVariant = 'highlight',
    className,
    style,
    accessibilityRole = 'button',
    ...restProps
  } = props;

  const { hexColors } = useUserTheme();

  const variantStyles = useMemo(() => getVariantStyles(variant, hexColors), [variant, hexColors]);

  const contextValue = useMemo(
    () => ({
      size,
      variant,
      isDisabled: isDisabled || isLoading,
    }),
    [size, variant, isDisabled, isLoading],
  );

  const combinedStyles = [
    styleSheet.buttonRoot,
    sizeStyles[size],
    isIconOnly && iconOnlySizeStyles[size],
    variantStyles.container,
    fullWidth && styleSheet.fullWidth,
    (isDisabled || isLoading) && styleSheet.disabled,
    style,
  ];

  return (
    <ButtonContext.Provider value={contextValue}>
      <PressableFeedback
        ref={ref}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled: isDisabled || isLoading }}
        className={className}
        isDisabled={isDisabled || isLoading}
        style={combinedStyles}
        {...restProps}
      >
        {pressableFeedbackVariant === 'highlight' && (
          <PressableFeedback.Highlight
            animation={{
              backgroundColor: { value: variantStyles.hoverColor },
              opacity: { value: [0, 1] },
            }}
          />
        )}
        {pressableFeedbackVariant === 'ripple' && (
          <PressableFeedback.Ripple
            animation={{
              backgroundColor: { value: variantStyles.hoverColor },
            }}
          />
        )}
        {isLoading ? <ActivityIndicator color={variantStyles.text.color} size="small" /> : children}
      </PressableFeedback>
    </ButtonContext.Provider>
  );
});

// Label Component
const ButtonLabel = forwardRef<Text, ButtonLabelProps>((props, ref) => {
  const { children, className, style, ...restProps } = props;
  const { size, variant } = useButton();
  const { hexColors } = useUserTheme();

  const variantStyles = useMemo(() => getVariantStyles(variant, hexColors), [variant, hexColors]);

  return (
    <Text
      ref={ref}
      className={className}
      style={[styleSheet.labelBase, labelSizeStyles[size], variantStyles.text, style]}
      {...restProps}
    >
      {children}
    </Text>
  );
});

// Icon Component
const ButtonIcon = forwardRef<View, ButtonIconProps>((props, ref) => {
  const { children, className, style, position = 'left', ...restProps } = props;

  return (
    <View
      ref={ref}
      className={className}
      style={[
        styleSheet.iconWrapper,
        position === 'left' ? styleSheet.iconLeft : styleSheet.iconRight,
        style,
      ]}
      {...restProps}
    >
      {children}
    </View>
  );
});

ButtonRoot.displayName = 'Button';
ButtonLabel.displayName = 'Button.Label';
ButtonIcon.displayName = 'Button.Icon';

/**
 * Compound Button component
 *
 * @example
 * // Simple usage
 * <Button>
 *   <Button.Label>Click me</Button.Label>
 * </Button>
 *
 * @example
 * // With icon
 * <Button>
 *   <Button.Icon><PlusIcon /></Button.Icon>
 *   <Button.Label>Add item</Button.Label>
 * </Button>
 *
 * @example
 * // Icon only
 * <Button isIconOnly>
 *   <TrashIcon />
 * </Button>
 */
const Button = Object.assign(ButtonRoot, {
  Label: ButtonLabel,
  Icon: ButtonIcon,
});

export { useButton };
export default Button;
