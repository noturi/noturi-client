import { View, ViewProps, ViewStyle } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  // Tamagui 호환 props
  padding?: string | number;
  paddingHorizontal?: string | number;
  paddingVertical?: string | number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  backgroundColor?: string;
  gap?: string | number;
  position?: ViewStyle['position'];
}

// Tamagui spacing 변환
function resolveSpacing(value?: string | number): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  const spacingMap: Record<string, number> = {
    $1: 2,
    $2: 4,
    $3: 8,
    $4: 12,
    $5: 16,
    $6: 24,
    $7: 32,
  };
  return spacingMap[value];
}

// Tamagui 색상값을 실제 색상으로 변환
function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  if (color.startsWith('$')) {
    const colorMap: Record<string, string> = {
      $primary: '#1d1d1d',
      $accent: '#ffc107',
      $error: '#f44336',
      $textPrimary: '#212121',
      $textSecondary: '#757575',
      $border: '#e0e0e0',
      $backgroundPrimary: '#ffffff',
      $backgroundSecondary: '#f5f5f5',
    };
    return colorMap[color] || color;
  }
  return color;
}

export function Card({
  children,
  style,
  // Tamagui 호환 props
  padding,
  paddingHorizontal,
  paddingVertical,
  alignItems,
  justifyContent,
  backgroundColor,
  gap,
  position,
  ...props
}: CardProps) {
  // Tamagui 호환 스타일 생성
  const extraStyles: ViewStyle = {};
  if (padding !== undefined) extraStyles.padding = resolveSpacing(padding);
  if (paddingHorizontal !== undefined)
    extraStyles.paddingHorizontal = resolveSpacing(paddingHorizontal);
  if (paddingVertical !== undefined) extraStyles.paddingVertical = resolveSpacing(paddingVertical);
  if (alignItems) extraStyles.alignItems = alignItems;
  if (justifyContent) extraStyles.justifyContent = justifyContent;
  if (backgroundColor) extraStyles.backgroundColor = resolveColor(backgroundColor);
  if (gap !== undefined) extraStyles.gap = resolveSpacing(gap);
  if (position) extraStyles.position = position;

  return (
    <View className="bg-surface rounded-6 p-3" style={[extraStyles, style]} {...props}>
      {children}
    </View>
  );
}
