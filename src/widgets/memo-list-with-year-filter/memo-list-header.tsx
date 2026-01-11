import { useUserTheme } from '~/application/providers/theme-provider';
import { ChevronDown } from '~/shared/lib/icons';
import { ControlledSheet, Typography } from '~/shared/ui';

import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';

const APP_LAUNCH_YEAR = 2025;

function getYearOptions(): { value: number | undefined; label: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { value: number | undefined; label: string }[] = [
    { value: undefined, label: '전체' },
  ];

  // 오름차순: 2025, 2026, ...
  for (let year = APP_LAUNCH_YEAR; year <= currentYear; year++) {
    years.push({ value: year, label: `${year}년` });
  }

  return years;
}

interface MemoListHeaderProps {
  selectedYear: number | undefined;
  onPressYear: () => void;
}

export function MemoListHeader({ selectedYear, onPressYear }: MemoListHeaderProps) {
  const selectedYearLabel = selectedYear ? `${selectedYear}년` : '전체';

  return (
    <View className="flex-row items-center justify-between px-3">
      <Typography variant="headline">메모</Typography>
      <Pressable className="flex-row items-center gap-2 active:opacity-70" onPress={onPressYear}>
        <Typography className="text-text-muted" variant="callout">
          {selectedYearLabel}
        </Typography>
        <ChevronDown className="text-text-muted" size={12} />
      </Pressable>
    </View>
  );
}

interface YearSelectSheetProps {
  isOpen: boolean;
  selectedYear: number | undefined;
  onClose: () => void;
  onYearChange: (year: number | undefined) => void;
}

export function YearSelectSheet({
  isOpen,
  selectedYear,
  onClose,
  onYearChange,
}: YearSelectSheetProps) {
  const { hexColors } = useUserTheme();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const handleYearSelect = useCallback(
    (value: number | undefined) => {
      onYearChange(value);
      onClose();
    },
    [onYearChange, onClose],
  );

  return (
    <ControlledSheet isOpen={isOpen} scrollable snapPoints={['40%']} onClose={onClose}>
      <View className="gap-2 p-4 pb-8">
        <Typography className="pb-2 text-center" variant="headline">
          년도 선택
        </Typography>
        {yearOptions.map((option) => {
          const isSelected = selectedYear === option.value;
          return (
            <Pressable
              key={option.label}
              className="items-center justify-center py-3 rounded-3 active:opacity-70"
              style={{
                backgroundColor: isSelected ? hexColors.primary : 'transparent',
              }}
              onPress={() => handleYearSelect(option.value)}
            >
              <Typography
                style={{
                  color: isSelected ? hexColors.primaryText : hexColors.textPrimary,
                }}
                variant="callout"
              >
                {option.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </ControlledSheet>
  );
}
