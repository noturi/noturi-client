import { View } from 'react-native';

import { Typography } from './typography';

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
    <View className="flex-1 items-center justify-center gap-3 bg-bg-primary p-3">
      <Typography className="text-center text-text-primary" variant="headline">
        {displayTitle}
      </Typography>

      <Typography className="max-w-[300px] text-center text-text-muted" variant="subheadline">
        {displayMessage}
      </Typography>
    </View>
  );
}
