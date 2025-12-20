import { Button, ScrollView, XStack, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

interface CategoryLite {
  id: string;
  name: string;
}

interface CategoryChipsProps {
  categories: CategoryLite[];
  selectedCategoryId?: string;
  onSelect: (id: string | undefined) => void;
}

export function CategoryChips({ categories, selectedCategoryId, onSelect }: CategoryChipsProps) {
  const handlePress = (id: string) => {
    onSelect(selectedCategoryId === id ? undefined : id);
  };

  return (
    <YStack gap="$1">
      <Typography variant="callout">카테고리</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$1">
          {categories.map((category) => (
            <Button
              key={category.id}
              backgroundColor={selectedCategoryId === category.id ? '$primary' : '$surface'}
              borderRadius="$2"
              color={selectedCategoryId === category.id ? '$textOnPrimary' : '$textSecondary'}
              height={32}
              justifyContent="center"
              paddingHorizontal="$1"
              onPress={() => handlePress(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
