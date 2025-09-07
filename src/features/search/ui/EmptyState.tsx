import { YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <YStack alignItems="center" flex={1} justifyContent="center" paddingHorizontal="$1">
      {icon}
      <Typography color="$textMuted" marginTop="$2" textAlign="center" variant="title">
        {title}
      </Typography>
      {description ? (
        <Typography color="$textMuted" marginTop="$1" textAlign="center" variant="body1">
          {description}
        </Typography>
      ) : null}
    </YStack>
  );
}
