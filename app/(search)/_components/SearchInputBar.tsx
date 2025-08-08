import { Button, TextArea, XStack, YStack } from 'tamagui';

import { Filter } from '@tamagui/lucide-icons';

interface SearchInputBarProps {
  searchText: string;
  onChangeSearchText: (text: string) => void;
  hasActiveFilters: boolean;
  onPressSearch: () => void;
  onToggleFilters: () => void;
}

export function SearchInputBar({
  searchText,
  onChangeSearchText,
  hasActiveFilters,
  onPressSearch,
  onToggleFilters,
}: SearchInputBarProps) {
  return (
    <XStack alignItems="center" gap="$3">
      <YStack flex={1}>
        <TextArea
          backgroundColor="$backgroundSecondary"
          borderRadius="$6"
          borderWidth={0}
          color="$textPrimary"
          fontSize="$4"
          maxHeight={48}
          multiline={false}
          padding="$3"
          placeholder="제목과 내용에서 검색..."
          placeholderTextColor="$textMuted"
          returnKeyType="search"
          value={searchText}
          onChangeText={onChangeSearchText}
          onSubmitEditing={onPressSearch}
        />
      </YStack>

      <Button
        backgroundColor={hasActiveFilters ? '$primary' : '$surface'}
        borderRadius="$6"
        color={hasActiveFilters ? '$textOnPrimary' : '$textSecondary'}
        size="$4"
        onPress={onToggleFilters}
      >
        <Filter size={16} />
      </Button>
    </XStack>
  );
}
