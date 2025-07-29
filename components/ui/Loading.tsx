import { Spinner, YStack } from "tamagui";
import { Typography } from "./Typography";

interface LoadingProps {
  text?: string;
  size?: "small" | "large";
  flex?: boolean;
}

/**
 * 로딩 상태를 표시하는 공용 컴포넌트
 */
export function Loading({
  text = "로딩 중...",
  size = "large",
  flex = true,
}: LoadingProps) {
  return (
    <YStack
      flex={flex ? 1 : undefined}
      justifyContent="center"
      alignItems="center"
      gap="$3"
      paddingVertical="$6"
    >
      <Spinner size={size} color="$textSecondary" />
      {text && (
        <Typography color="$textSecondary" variant="body">
          {text}
        </Typography>
      )}
    </YStack>
  );
}
