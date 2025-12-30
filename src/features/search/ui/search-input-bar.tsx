import { Filter, Search } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';

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
  const { hexColors } = useUserTheme();

  return (
    <View className="flex-row items-center gap-1">
      <View className="flex-1">
        <View
          className="h-12 flex-row items-center gap-1 rounded-6 px-2"
          style={{ backgroundColor: hexColors.bgSecondary }}
        >
          <Search color={hexColors.textMuted} size={20} />
          <TextInput
            autoFocus
            className="flex-1"
            placeholder="제목 및 내용 검색"
            placeholderTextColor={hexColors.textMuted}
            returnKeyType="search"
            style={{
              color: hexColors.textPrimary,
              fontSize: 16,
            }}
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
        <Filter color={hexColors.textSecondary} size={20} />
      </Pressable>
    </View>
  );
}
