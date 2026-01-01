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
                className={`h-8 items-center justify-center rounded-2 px-3 ${
                  isSelected ? 'bg-primary' : 'bg-surface'
                }`}
                onPress={() => handlePress(category.id)}
              >
                <Typography
                  className={isSelected ? 'text-primary-text' : 'text-text-secondary'}
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
