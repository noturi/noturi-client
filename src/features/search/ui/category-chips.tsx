import { useUserTheme } from '~/application/providers/theme-provider';
import { Typography } from '~/shared/ui';

import { Pressable, ScrollView, View } from 'react-native';

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
  const { hexColors } = useUserTheme();

  const handlePress = (id: string) => {
    onSelect(selectedCategoryId === id ? undefined : id);
  };

  return (
    <View className="gap-1">
      <Typography variant="callout">카테고리</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-1">
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <Pressable
                key={category.id}
                className="h-8 items-center justify-center rounded-2 px-3"
                style={{
                  backgroundColor: isSelected ? hexColors.primary : hexColors.surface,
                }}
                onPress={() => handlePress(category.id)}
              >
                <Typography
                  color={isSelected ? hexColors.primaryText : hexColors.textSecondary}
                  variant="callout"
                >
                  {category.name}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
