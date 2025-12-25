import { Check, ChevronDown, ChevronUp, Palette } from 'lucide-react-native';
import { Card } from '~/shared/ui/card';
import { Typography } from '~/shared/ui/typography';

import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { useUserTheme } from '../model/theme-context';
import { ThemePreset, rgbToHex } from '../model/theme-store';

interface ThemePreviewProps {
  preset: ThemePreset;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemePreview({ preset, isSelected, onSelect }: ThemePreviewProps) {
  const { hexColors } = useUserTheme();
  const bgColor = rgbToHex(preset.colors.bgPrimary);
  const textColor = rgbToHex(preset.colors.textPrimary);
  const accentColor = rgbToHex(preset.colors.accent);
  const borderColor = rgbToHex(preset.colors.border);
  const currentAccent = hexColors.accent;
  const currentBorder = hexColors.border;
  const currentTextPrimary = hexColors.textPrimary;

  return (
    <Pressable onPress={onSelect}>
      <View
        className="w-[100px] items-center gap-2 rounded-5 border-2 p-2"
        style={{ borderColor: isSelected ? currentAccent : currentBorder }}
      >
        {/* 테마 미리보기 박스 */}
        <View
          className="h-[60px] w-full justify-center rounded-4 border p-2"
          style={{ backgroundColor: bgColor, borderColor }}
        >
          <View className="mb-1 h-2 w-[60%] rounded-2" style={{ backgroundColor: accentColor }} />
          <View
            className="h-1 w-[80%] rounded-1"
            style={{ backgroundColor: textColor, opacity: 0.6 }}
          />
          <View
            className="mt-1 h-1 w-[50%] rounded-1"
            style={{ backgroundColor: textColor, opacity: 0.3 }}
          />
        </View>

        {/* 테마 이름 */}
        <View className="flex-row items-center gap-1">
          {isSelected && <Check color={currentAccent} size={14} />}
          <Typography
            style={{ color: isSelected ? currentAccent : currentTextPrimary }}
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
