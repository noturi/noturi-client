import { ScrollView, XStack, YStack } from 'tamagui';
import type { UICategory } from '~/entities/category/model/types';
import { CategoryButton } from '~/features/categories/ui/CategoryButton';

type CategoryFilterBarProps = {
  categories: UICategory[];
  onPress: (categoryName: string) => void;
};

export function CategoryFilterBar({ categories, onPress }: CategoryFilterBarProps) {
  return (
    <YStack height={65} justifyContent="center">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$1.5" paddingHorizontal="$4" paddingVertical="$1.5">
          {categories.map((category) => (
            <CategoryButton
              key={category.name}
              category={category}
              onPress={() => onPress(category.name)}
            />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
