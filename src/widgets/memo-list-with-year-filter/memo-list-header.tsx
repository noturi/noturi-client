import { ChevronDown } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { ControlledSheet, Typography } from '~/shared/ui';

import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

const APP_LAUNCH_YEAR = 2025;

function getYearOptions(): { value: number | undefined; label: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { value: number | undefined; label: string }[] = [
    { value: undefined, label: '전체' },
  ];

  for (let year = currentYear; year >= APP_LAUNCH_YEAR; year--) {
    years.push({ value: year, label: `${year}년` });
  }

  return years;
}

interface MemoListHeaderProps {
  selectedYear: number | undefined;
  onYearChange: (year: number | undefined) => void;
}

export function MemoListHeader({ selectedYear, onYearChange }: MemoListHeaderProps) {
  const [showYearSheet, setShowYearSheet] = useState(false);
  const { hexColors } = useUserTheme();

  const yearOptions = useMemo(() => getYearOptions(), []);
  const selectedYearLabel = selectedYear ? `${selectedYear}년` : '전체';

  const handleYearSelect = useCallback(
    (value: number | undefined) => {
      onYearChange(value);
      setShowYearSheet(false);
    },
    [onYearChange],
  );

  return (
    <>
      <View className="flex-row items-center justify-between px-3">
        <Typography variant="headline">메모</Typography>
        <Pressable
          className="flex-row items-center gap-2 active:opacity-70"
          onPress={() => setShowYearSheet(true)}
        >
          <Typography className="text-text-muted" variant="callout">
            {selectedYearLabel}
          </Typography>
          <ChevronDown color={hexColors.textMuted} size={12} />
        </Pressable>
      </View>

      <ControlledSheet
        isOpen={showYearSheet}
        snapPoints={['30%']}
        onClose={() => setShowYearSheet(false)}
      >
        <View className="gap-2 p-4">
          <Typography className="pb-2 text-center" variant="headline">
            년도 선택
          </Typography>
          {yearOptions.map((option) => (
            <Pressable
              key={option.label}
              className={`items-center justify-center py-3 rounded-3 active:opacity-70 ${
                selectedYear === option.value ? 'bg-primary' : 'bg-transparent'
              }`}
              onPress={() => handleYearSelect(option.value)}
            >
              <Typography
                className={
                  selectedYear === option.value ? 'text-primary-text' : 'text-text-primary'
                }
                variant="callout"
              >
                {option.label}
              </Typography>
            </Pressable>
          ))}
        </View>
      </ControlledSheet>
    </>
  );
}
