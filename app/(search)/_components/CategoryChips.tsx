import { Typography } from "@/components/ui";
import { Button, ScrollView, XStack, YStack } from "tamagui";

interface CategoryLite {
  id: string;
  name: string;
}

interface CategoryChipsProps {
  categories: CategoryLite[];
  selectedCategoryId: string;
  onSelect: (id: string) => void;
}

export function CategoryChips({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryChipsProps) {
  return (
    <YStack gap="$2">
      <Typography variant="title" fontSize="$3">
        카테고리
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2">
          <Button
            backgroundColor={
              selectedCategoryId === "" ? "$primary" : "$surface"
            }
            color={
              selectedCategoryId === "" ? "$textOnPrimary" : "$textSecondary"
            }
            borderRadius="$5"
            size="$3"
            onPress={() => onSelect("")}
          >
            전체
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              backgroundColor={
                selectedCategoryId === c.id ? "$primary" : "$surface"
              }
              color={
                selectedCategoryId === c.id
                  ? "$textOnPrimary"
                  : "$textSecondary"
              }
              borderRadius="$5"
              size="$3"
              onPress={() => onSelect(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
