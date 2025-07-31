import { Typography } from "@/components/ui";
import { Button, XStack, YStack } from "tamagui";

interface MemoFormHeaderProps {
  onClose: () => void;
}

export const MemoFormHeader = ({ onClose }: MemoFormHeaderProps) => {
  return (
    <>
      {/* Handle */}
      <YStack alignItems="center" paddingTop="$2" paddingBottom="$1">
        <YStack
          width={36}
          height={4}
          backgroundColor="$textMuted"
          borderRadius="$2"
        />
      </YStack>

      {/* Header */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$2"
        paddingVertical="$3"
        borderBottomWidth={1}
        borderBottomColor="$border"
      >
        <Button
          size="$3"
          backgroundColor="$backgroundTransparent"
          color="$textSecondary"
          borderWidth={0}
          pressStyle={{ backgroundColor: "$backgroundTransparent" }}
          borderRadius="$4"
          onPress={onClose}
        >
          취소
        </Button>
        <Typography variant="subheading">새 기록</Typography>
        <YStack width={60} />
      </XStack>
    </>
  );
};
