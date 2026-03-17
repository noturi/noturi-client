import { useUserTheme } from '~/application/providers/theme-provider';
import { Moon } from '~/shared/lib/icons';
import { Switch, Typography } from '~/shared/ui';

import { View } from 'react-native';

export function ThemeSettings() {
  const { isDark, toggleTheme } = useUserTheme();

  return (
    <View className="flex-row items-center gap-3 rounded-5 px-4 py-3">
      <Moon className="text-text-secondary" size={20} />
      <View className="flex-1">
        <Typography className="text-text-primary" variant="callout">
          다크 모드
        </Typography>
      </View>
      <Switch checked={isDark} onCheckedChange={() => toggleTheme()} />
    </View>
  );
}
