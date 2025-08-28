import { Button, ScrollView, XStack, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

interface CategoryLite {
  id: string;
  name: string;
}

interface CategoryChipsProps {
  categories: CategoryLite[];
  selectedCategoryIds?: string[];
  onToggle: (id: string) => void;
}

export function CategoryChips({
  categories,
  selectedCategoryIds = [],
  onToggle,
}: CategoryChipsProps) {
  return (
    <YStack gap="$2">
      <Typography variant="subtitle">카테고리</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2">
          {categories.map((category) => (
            <Button
              key={category.id}
              backgroundColor={selectedCategoryIds.includes(category.id) ? '$primary' : '$surface'}
              borderRadius="$sm"
              color={
                selectedCategoryIds.includes(category.id) ? '$textOnPrimary' : '$textSecondary'
              }
              height={32}
              justifyContent="center"
              paddingHorizontal="$2"
              onPress={() => onToggle(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
