import { Spinner, YStack } from 'tamagui';

import { Typography } from './Typography';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  flex?: boolean;
}

/**
 * 로딩 상태를 표시하는 공용 컴포넌트
 */
export function Loading({ text = '로딩 중...', size = 'large', flex = true }: LoadingProps) {
  return (
    <YStack
      alignItems="center"
      flex={flex ? 1 : undefined}
      gap="$xl"
      justifyContent="center"
      paddingVertical="$6xl"
    >
      <Spinner color="$textSecondary" size={size} />
      {text && (
        <Typography color="$textSecondary" variant="body1">
          {text}
        </Typography>
      )}
    </YStack>
  );
}
