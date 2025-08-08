import { Filter } from "@tamagui/lucide-icons";
import { Button, TextArea, XStack, YStack } from "tamagui";

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
    <XStack gap="$3" alignItems="center">
      <YStack flex={1}>
        <TextArea
          placeholder="제목과 내용에서 검색..."
          value={searchText}
          onChangeText={onChangeSearchText}
          backgroundColor="$backgroundSecondary"
          borderWidth={0}
          borderRadius="$6"
          fontSize="$4"
          color="$textPrimary"
          placeholderTextColor="$textMuted"
          padding="$3"
          maxHeight={48}
          multiline={false}
          onSubmitEditing={onPressSearch}
          returnKeyType="search"
        />
      </YStack>

      <Button
        size="$4"
        backgroundColor={hasActiveFilters ? "$primary" : "$surface"}
        color={hasActiveFilters ? "$textOnPrimary" : "$textSecondary"}
        borderRadius="$6"
        onPress={onToggleFilters}
      >
        <Filter size={16} />
      </Button>
    </XStack>
  );
}
