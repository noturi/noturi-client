import { Spinner, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  flex?: boolean;
}

/**
 * 로딩 상태를 표시하는 공용 컴포넌트
 */
export function Loading({ text = '', size = 'small', flex = true }: LoadingProps) {
  return (
    <YStack
      alignItems="center"
      flex={flex ? 1 : undefined}
      gap="$5"
      justifyContent="center"
      paddingVertical="$10"
    >
      <Spinner color="$textSecondary" size={size} />
      {text && (
        <Typography color="$textSecondary" variant="caption1">
          {text}
        </Typography>
      )}
    </YStack>
  );
}
