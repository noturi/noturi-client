import { Check, ChevronDown, ChevronUp, Palette } from 'lucide-react-native';
import { useUserTheme } from '~/application/providers/theme-provider';
import { PRESET_HEX_COLORS, ThemePreset } from '~/shared/config/theme';
import { Card } from '~/shared/ui/card';
import { Typography } from '~/shared/ui/typography';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

interface ThemePreviewProps {
  preset: ThemePreset;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemePreview({ preset, isSelected, onSelect }: ThemePreviewProps) {
  const { hexColors } = useUserTheme();
  const presetHex = PRESET_HEX_COLORS[preset.id];

  return (
    <Pressable onPress={onSelect}>
      <View
        className="w-[100px] items-center gap-2 rounded-5 border-2 p-2"
        style={{ borderColor: isSelected ? hexColors.selection : hexColors.border }}
      >
        {/* 테마 미리보기 박스 */}
        <View
          className="h-[60px] w-full justify-center rounded-4 border p-2"
          style={{ backgroundColor: presetHex.bgPrimary, borderColor: presetHex.border }}
        >
          <View
            className="mb-1 h-2 w-[60%] rounded-2"
            style={{ backgroundColor: presetHex.selection }}
          />
          <View
            className="h-1 w-[80%] rounded-1"
            style={{ backgroundColor: presetHex.textPrimary, opacity: 0.6 }}
          />
          <View
            className="mt-1 h-1 w-[50%] rounded-1"
            style={{ backgroundColor: presetHex.textPrimary, opacity: 0.3 }}
          />
        </View>

        {/* 테마 이름 */}
        <View className="flex-row items-center gap-1">
          {isSelected && <Check color={hexColors.selection} size={14} />}
          <Typography
            style={{ color: isSelected ? hexColors.selection : hexColors.textPrimary }}
            variant="footnote"
          >
            {preset.name}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
}

export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { themeId, setTheme, presets, hexColors } = useUserTheme();

  return (
    <Card>
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Palette color={hexColors.textSecondary} size={20} />
          <Typography className="flex-1 text-text-primary" variant="callout">
            테마 설정
          </Typography>
          {isOpen ? (
            <ChevronUp color={hexColors.textMuted} size={20} />
          ) : (
            <ChevronDown color={hexColors.textMuted} size={20} />
          )}
        </View>
      </Pressable>

      {isOpen && (
        <View className="flex-row flex-wrap justify-center gap-3 px-3 pb-4">
          {presets.map((preset) => (
            <ThemePreview
              key={preset.id}
              isSelected={themeId === preset.id}
              preset={preset}
              onSelect={() => setTheme(preset.id)}
            />
          ))}
        </View>
      )}
    </Card>
  );
}
