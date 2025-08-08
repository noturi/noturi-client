import { Typography } from "@/components/ui";
import { ReactNode } from "react";
import { YStack } from "tamagui";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$4"
    >
      {icon}
      <Typography variant="title" color="$textMuted" textAlign="center" marginTop="$3">
        {title}
      </Typography>
      {description ? (
        <Typography variant="body" color="$textMuted" textAlign="center" marginTop="$2">
          {description}
        </Typography>
      ) : null}
    </YStack>
  );
}


