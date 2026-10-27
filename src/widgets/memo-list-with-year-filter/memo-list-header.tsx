import { ChevronDown } from '~/shared/lib/icons';
import { useUserTheme } from '~/shared/lib/theme-context';
import { ControlledSheet, Typography } from '~/shared/ui';

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
  const yearOptions = getYearOptions();

  const handleYearSelect = (value: number | undefined) => {
    onYearChange(value);
    onClose();
  };

  return (
    <ControlledSheet
      scrollable
      isOpen={isOpen}
      snapPoints={['40%']}
      title="년도 선택"
      onClose={onClose}
    >
      {/* 제목~첫 항목 간격 16 유지 (기존 pb-2 + gap-2) */}
      <View className="gap-2 p-4 pb-8">
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
