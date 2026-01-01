import { Filter, Search } from '~/shared/lib/icons';

import { Pressable, TextInput, View } from 'react-native';

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
    <View className="flex-row items-center gap-1">
      <View className="flex-1">
        <View className="h-12 flex-row items-center gap-1 rounded-6 bg-bg-secondary px-2">
          <Search className="text-text-muted" size={20} />
          <TextInput
            autoFocus
            className="flex-1 text-text-primary text-base"
            placeholder="제목 및 내용 검색"
            placeholderClassName="text-text-muted"
            returnKeyType="search"
            value={searchText}
            onChangeText={onChangeSearchText}
            onSubmitEditing={onPressSearch}
          />
        </View>
      </View>

      <Pressable
        className="h-12 w-12 items-center justify-center rounded-full"
        onPress={onToggleFilters}
      >
        <Filter className="text-text-secondary" size={20} />
      </Pressable>
    </View>
  );
}
