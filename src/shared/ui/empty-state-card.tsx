import { View } from 'react-native';

import { Typography } from './typography';

interface EmptyStateCardProps {
  title: string;
  description?: string;
}

/** 목록이 비었을 때 카드 영역을 차지하는 빈 상태 (할 일·메모 목록 공통) */
export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <View className="items-center justify-center rounded-4 bg-surface py-12">
      <Typography className="text-text-muted" variant="body">
        {title}
      </Typography>
      {description ? (
        <Typography className="mt-1 text-text-muted" variant="footnote">
          {description}
        </Typography>
      ) : null}
    </View>
  );
}
