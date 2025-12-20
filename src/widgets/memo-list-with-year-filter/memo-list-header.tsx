import { Sheet, XStack, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { useCallback, useMemo, useState } from 'react';

import { ChevronDown } from '@tamagui/lucide-icons';

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
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$3">
        <Typography variant="headline">메모</Typography>
        <XStack
          alignItems="center"
          gap="$2"
          pressStyle={{ opacity: 0.7 }}
          onPress={() => setShowYearSheet(true)}
        >
          <Typography color="$textMuted" variant="callout">
            {selectedYearLabel}
          </Typography>
          <ChevronDown color="$textMuted" size="$1" />
        </XStack>
      </XStack>

      <Sheet
        dismissOnOverlayPress
        dismissOnSnapToBottom
        modal
        animation="quick"
        open={showYearSheet}
        snapPoints={[30]}
        snapPointsMode="percent"
        onOpenChange={setShowYearSheet}
      >
        <Sheet.Overlay
          animation="quick"
          backgroundColor="$backgroundOverlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame
          backgroundColor="$backgroundPrimary"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$4"
        >
          <YStack gap="$2">
            <Typography paddingBottom="$2" textAlign="center" variant="headline">
              년도 선택
            </Typography>
            {yearOptions.map((option) => (
              <XStack
                key={option.label}
                alignItems="center"
                backgroundColor={selectedYear === option.value ? '$primary' : 'transparent'}
                borderRadius="$3"
                gap="$2"
                justifyContent="center"
                paddingVertical="$3"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => handleYearSelect(option.value)}
              >
                <Typography
                  color={selectedYear === option.value ? '$textOnPrimary' : '$textPrimary'}
                  variant="callout"
                >
                  {option.label}
                </Typography>
              </XStack>
            ))}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
