import { ScrollView, XStack, YStack } from 'tamagui';
import { Category } from '~/entities/category/model/types';
import { Button, Input, Typography } from '~/shared/ui';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  newCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onNewCategoryChange: (value: string) => void;
}

export const CategorySelector = ({
  categories,
  selectedCategory,
  newCategory,
  onSelectCategory,
  onNewCategoryChange,
}: CategorySelectorProps) => {
  return (
    <YStack gap="$2">
      <Typography variant="headline">카테고리</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.name ? 'primary' : 'ghost'}
              onPress={() => onSelectCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onPress={() => onSelectCategory('')}>
            + 추가
          </Button>
        </XStack>
      </ScrollView>

      {!selectedCategory && (
        <Input
          paddingVertical="$2"
          placeholder="새 카테고리 입력"
          placeholderTextColor="$textMuted"
          value={newCategory}
          onChangeText={onNewCategoryChange}
        />
      )}
    </YStack>
  );
};
