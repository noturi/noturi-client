import { SHADOW_COLOR } from '~/shared/config';
import { Check, Plus } from '~/shared/lib/icons';
import { useThemeColor } from '~/shared/lib/theme-context';

import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

import { Typography } from './typography';

interface FloatingButtonProps extends PressableProps {
  onPress: () => void;
  isLoading?: boolean;
  /** 아이콘 — 추가(+, 기본) / 저장·완료(✓) */
  icon?: 'plus' | 'check';
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

// iOS 26+ Liquid Glass 사용 가능 여부 — 앱 실행 중 바뀌지 않으므로 모듈 상수
const USES_GLASS = Platform.OS === 'ios' && isLiquidGlassAvailable();

const shadowStyle = {
  shadowColor: SHADOW_COLOR,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 5,
};

export function FloatingButton({
  onPress,
  disabled = false,
  isLoading = false,
  icon = 'plus',
  children,
  style,
  className,
  ...props
}: FloatingButtonProps) {
  const isDisabled = disabled || isLoading;
  const [spinnerColor, primaryColor] = useThemeColor(['primaryText', 'primary']);

  // 44px: iOS 최소 터치 영역 — 스페이싱 스케일(32/48)에 없는 값
  return (
    <Pressable
      className={`h-[44px] items-center justify-center rounded-full ${USES_GLASS ? '' : 'bg-primary'} ${children ? 'min-w-[44px] px-3' : 'w-[44px]'} ${isDisabled ? 'opacity-60' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      style={({ pressed }) => [
        // 글래스는 자체 그림자·눌림 반응이 있어 커스텀 그림자/스케일을 쓰지 않음
        !USES_GLASS && shadowStyle,
        !USES_GLASS && pressed && !isDisabled && { opacity: 0.8, transform: [{ scale: 1.05 }] },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {USES_GLASS && (
        <GlassView
          isInteractive
          glassEffectStyle="regular"
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
          tintColor={primaryColor}
        />
      )}
      {isLoading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color={spinnerColor} size="small" />
          {children && (
            <Typography className="text-primary-text" variant="body">
              {children}
            </Typography>
          )}
        </View>
      ) : children ? (
        <Typography className="text-primary-text" variant="body">
          {children}
        </Typography>
      ) : icon === 'check' ? (
        <Check className="text-primary-text" size={24} />
      ) : (
        <Plus className="text-primary-text" size={24} />
      )}
    </Pressable>
  );
}
