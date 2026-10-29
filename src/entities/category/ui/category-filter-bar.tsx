import { Typography } from '~/shared/ui';

import { Pressable, ScrollView, View } from 'react-native';

import type { UICategory } from '../model/types';

type CategoryFilterBarProps = {
  categories: UICategory[];
  onPress: (categoryName: string) => void;
};

/** 홈 상단 카테고리 탭 — 카드 대신 글자 한 줄로 가볍게, 선택된 탭만 굵게 + 밑줄 */
export function CategoryFilterBar({ categories, onPress }: CategoryFilterBarProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-5">
        {categories.map((category) => (
          <Pressable
            key={category.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: category.active }}
            className="active:opacity-60"
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            onPress={() => onPress(category.name)}
          >
            <Typography
              className={category.active ? 'text-text-primary' : 'text-text-muted'}
              variant="subheadline"
              weight={category.active ? 'semibold' : 'regular'}
            >
              {category.name}
            </Typography>
            <View
              className={`mt-1 h-0.5 rounded-full ${category.active ? 'bg-text-primary' : 'bg-transparent'}`}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
