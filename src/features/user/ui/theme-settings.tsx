import { useUserTheme } from '~/application/providers/theme-provider';
import { PRESET_HEX_COLORS, ThemePreset } from '~/shared/config/theme';
import { Check, Palette } from '~/shared/lib/icons';
import { Accordion } from '~/shared/ui/accordion';
import { Card } from '~/shared/ui/card';
import { Typography } from '~/shared/ui/typography';

import { Pressable, View } from 'react-native';

interface ThemePreviewProps {
  preset: ThemePreset;
  isSelected: boolean;
  onSelect: () => void;
}

function ThemePreview({ preset, isSelected, onSelect }: ThemePreviewProps) {
  const presetHex = PRESET_HEX_COLORS[preset.id];

  return (
    <Pressable onPress={onSelect}>
      <View
        className={`w-[100px] items-center gap-2 rounded-5 border-2 p-2 ${
          isSelected ? 'border-selection' : 'border-border'
        }`}
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
          {isSelected && <Check className="text-selection" size={14} />}
          <Typography
            className={isSelected ? 'text-selection' : 'text-text-primary'}
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
  const { themeId, setTheme, presets } = useUserTheme();

  return (
    <Card>
      <Accordion icon={<Palette className="text-text-secondary" size={20} />} title="테마 설정">
        <View className="flex-row flex-wrap justify-center gap-3 px-3 pb-4 pt-2">
          {presets.map((preset) => (
            <ThemePreview
              key={preset.id}
              isSelected={themeId === preset.id}
              preset={preset}
              onSelect={() => setTheme(preset.id)}
            />
          ))}
        </View>
      </Accordion>
    </Card>
  );
}
