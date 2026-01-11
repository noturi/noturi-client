import type { UICategory } from '~/entities/category/model/types';
import { CategoryButton } from '~/entities/category/ui/category-button';
import { Card } from '~/shared/ui';

import { ScrollView, View } from 'react-native';

type CategoryFilterBarProps = {
  categories: UICategory[];
  onPress: (categoryName: string) => void;
};

export function CategoryFilterBar({ categories, onPress }: CategoryFilterBarProps) {
  return (
    <Card>
      <View className="justify-center">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 px-3 py-3">
            {categories.map((category) => (
              <CategoryButton
                key={category.name}
                category={category}
                onPress={() => onPress(category.name)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Card>
  );
}
