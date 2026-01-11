import { Typography } from '~/shared/ui';

import { ReactNode } from 'react';
import { View } from 'react-native';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-4">
      {icon}
      <Typography className="mt-2 text-center text-text-muted" variant="headline">
        {title}
      </Typography>
      {description ? (
        <Typography className="mt-1 text-center text-text-muted" variant="body">
          {description}
        </Typography>
      ) : null}
    </View>
  );
}
