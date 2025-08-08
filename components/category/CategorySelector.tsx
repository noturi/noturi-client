import { Button, Input, ScrollView, XStack, YStack } from 'tamagui';

import { Typography } from '@/components/ui';
import { Category } from '@/services/category/types';

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
    <YStack gap="$3">
      <Typography variant="title">카테고리</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$3">
          {categories.map((category) => (
            <Button
              key={category.id}
              backgroundColor={selectedCategory === category.name ? '$textPrimary' : '$surface'}
              borderColor={selectedCategory === category.name ? '$textPrimary' : '$border'}
              borderRadius="$4"
              borderWidth={1}
              color={selectedCategory === category.name ? '$textOnPrimary' : '$textPrimary'}
              fontSize="$3"
              paddingHorizontal="$3"
              pressStyle={{
                backgroundColor:
                  selectedCategory === category.name ? '$textPrimary' : '$surfaceHover',
              }}
              size="$2"
              onPress={() => onSelectCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
          <Button
            backgroundColor="$backgroundPrimary"
            borderColor="$border"
            borderRadius="$4"
            borderStyle="dashed"
            borderWidth={1}
            color="$textSecondary"
            fontSize="$3"
            paddingHorizontal="$3"
            pressStyle={{ backgroundColor: '$surfaceHover' }}
            size="$2"
            onPress={() => onSelectCategory('')}
          >
            + 추가
          </Button>
        </XStack>
      </ScrollView>

      {!selectedCategory && (
        <Input
          backgroundColor="$backgroundPrimary"
          borderColor="$border"
          borderRadius="$4"
          borderWidth={1}
          color="$textPrimary"
          fontSize="$4"
          paddingHorizontal="$4"
          paddingVertical="$3"
          placeholder="새 카테고리 입력"
          placeholderTextColor="$textMuted"
          value={newCategory}
          onChangeText={onNewCategoryChange}
        />
      )}
    </YStack>
  );
};
