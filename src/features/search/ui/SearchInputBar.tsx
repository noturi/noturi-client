import { Button, TextArea, XStack, YStack } from 'tamagui';

import { Filter, Search } from '@tamagui/lucide-icons';

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
    <XStack alignItems="center" gap="$1">
      <YStack flex={1}>
        <XStack
          alignItems="center"
          backgroundColor="$backgroundSecondary"
          borderRadius="$6"
          gap="$1"
          height={48}
          paddingHorizontal="$2"
        >
          <Search color="$textMuted" size="$4" />
          <TextArea
            autoFocus
            backgroundColor="$backgroundTransparent"
            borderWidth={0}
            color="$textPrimary"
            flex={1}
            fontSize="$4"
            multiline={false}
            placeholder="제목 및 내용 검색"
            placeholderTextColor="$textMuted"
            returnKeyType="search"
            value={searchText}
            onChangeText={onChangeSearchText}
            onSubmitEditing={onPressSearch}
          />
        </XStack>
      </YStack>

      <Button circular color="$textOnPrimary" onPress={onToggleFilters}>
        <Filter color="$textSecondary" size="$4" />
      </Button>
    </XStack>
  );
}
