import { Button, Text, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      <Text
        fontSize="$8"
        fontWeight="bold"
        color="$textPrimary"
        marginBottom="$4"
      >
        노투리
      </Text>

      <Text fontSize="$4" color="$textSecondary" marginBottom="$6">
        내 메모들
      </Text>

      <Button
        size="$4"
        backgroundColor="$primary"
        color="white"
        pressStyle={{
          backgroundColor: "$primaryHover",
        }}
      >
        메모 작성하기
      </Button>
    </YStack>
  );
}
