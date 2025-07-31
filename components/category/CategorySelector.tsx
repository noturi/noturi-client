import { Typography } from "@/components/ui";
import { Category } from "@/services/category/types";
import { Button, Input, ScrollView, XStack, YStack } from "tamagui";

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
              size="$2"
              backgroundColor={
                selectedCategory === category.name
                  ? "$textPrimary"
                  : "$surface"
              }
              borderWidth={1}
              borderColor={
                selectedCategory === category.name
                  ? "$textPrimary"
                  : "$border"
              }
              color={
                selectedCategory === category.name
                  ? "$textOnPrimary"
                  : "$textPrimary"
              }
              borderRadius="$4"
              fontSize="$3"
              paddingHorizontal="$3"
              pressStyle={{
                backgroundColor:
                  selectedCategory === category.name
                    ? "$textPrimary"
                    : "$surfaceHover",
              }}
              onPress={() => onSelectCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
          <Button
            size="$2"
            backgroundColor="$backgroundPrimary"
            borderWidth={1}
            borderColor="$border"
            borderStyle="dashed"
            color="$textSecondary"
            borderRadius="$4"
            fontSize="$3"
            paddingHorizontal="$3"
            pressStyle={{ backgroundColor: "$surfaceHover" }}
            onPress={() => onSelectCategory("")}
          >
            + 추가
          </Button>
        </XStack>
      </ScrollView>

      {!selectedCategory && (
        <Input
          placeholder="새 카테고리 입력"
          value={newCategory}
          onChangeText={onNewCategoryChange}
          backgroundColor="$backgroundPrimary"
          borderWidth={1}
          borderColor="$border"
          borderRadius="$4"
          fontSize="$4"
          color="$textPrimary"
          placeholderTextColor="$textMuted"
          paddingHorizontal="$4"
          paddingVertical="$3"
        />
      )}
    </YStack>
  );
};