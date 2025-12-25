import { Filter, Search } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';

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
  const { currentTheme } = useUserTheme();
  const bgSecondary = rgbToHex(currentTheme.colors.bgSecondary);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);
  const textColor = rgbToHex(currentTheme.colors.textPrimary);
  const textSecondary = rgbToHex(currentTheme.colors.textSecondary);

  return (
    <View className="flex-row items-center gap-1">
      <View className="flex-1">
        <View
          className="h-12 flex-row items-center gap-1 rounded-6 px-2"
          style={{ backgroundColor: bgSecondary }}
        >
          <Search color={textMuted} size={20} />
          <TextInput
            autoFocus
            className="flex-1"
            placeholder="제목 및 내용 검색"
            placeholderTextColor={textMuted}
            returnKeyType="search"
            style={{
              color: textColor,
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
        <Filter color={textSecondary} size={20} />
      </Pressable>
    </View>
  );
}
