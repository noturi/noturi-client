import type { SortOption } from '~/entities/category/model/types';
import { SortButton } from '~/entities/category/ui/sort-button';

import { View } from 'react-native';

type SortOptionsBarProps = {
  options: SortOption[];
  onPress: (sortName: string) => void;
};

export function SortOptionsBar({ options, onPress }: SortOptionsBarProps) {
  return (
    <View className="h-[45px] justify-center">
      <View className="flex-row px-4 relative">
        {options.map((option) => (
          <SortButton key={option.name} option={option} onPress={() => onPress(option.name)} />
        ))}
      </View>
    </View>
  );
}
