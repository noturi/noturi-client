import { YStack } from 'tamagui';

import { ReactNode } from 'react';

import { Typography } from '@/components/ui';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <YStack alignItems="center" flex={1} justifyContent="center" paddingHorizontal="$4">
      {icon}
      <Typography color="$textMuted" marginTop="$3" textAlign="center" variant="title">
        {title}
      </Typography>
      {description ? (
        <Typography color="$textMuted" marginTop="$2" textAlign="center" variant="body">
          {description}
        </Typography>
      ) : null}
    </YStack>
  );
}
