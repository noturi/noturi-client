import { XStack, YStack } from 'tamagui';
import type { SortOption } from '~/entities/category/model/types';
import { SortButton } from '~/features/categories/ui/SortButton';

type SortOptionsBarProps = {
  options: SortOption[];
  onPress: (sortName: string) => void;
};

export function SortOptionsBar({ options, onPress }: SortOptionsBarProps) {
  return (
    <YStack height={45} justifyContent="center">
      <XStack paddingHorizontal="$4" position="relative">
        {options.map((option) => (
          <SortButton key={option.name} option={option} onPress={() => onPress(option.name)} />
        ))}
      </XStack>
    </YStack>
  );
}
