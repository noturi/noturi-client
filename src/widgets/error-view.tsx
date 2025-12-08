import { YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

interface ErrorViewProps {
  title?: string;
  message?: string;
  error?: Error | null;
}

function isNetworkError(error?: Error | null): boolean {
  return (
    error?.message?.includes('Network request failed') ||
    error?.message?.includes('카테고리 목록을 불러오는데 실패했습니다') ||
    false
  );
}

export function ErrorView({ title, message, error }: ErrorViewProps) {
  const isNetwork = isNetworkError(error);

  const displayTitle = title ?? (isNetwork ? '서버 연결 실패' : '오류가 발생했습니다');
  const displayMessage =
    message ??
    (isNetwork
      ? '서버에 연결할 수 없습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'
      : '예상치 못한 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');

  return (
    <YStack
      alignItems="center"
      backgroundColor="$backgroundPrimary"
      flex={1}
      gap="$3"
      justifyContent="center"
      padding="$3"
    >
      <Typography color="$textPrimary" fontSize="$5" fontWeight="$5" textAlign="center">
        {displayTitle}
      </Typography>

      <Typography color="$textMuted" fontSize="$3" maxWidth={300} textAlign="center">
        {displayMessage}
      </Typography>
    </YStack>
  );
}
