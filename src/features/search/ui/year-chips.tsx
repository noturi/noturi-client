import { Button, ScrollView, XStack, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

interface YearChipsProps {
  selectedYear?: number;
  onSelect: (year: number | undefined) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export function YearChips({ selectedYear, onSelect }: YearChipsProps) {
  const handlePress = (year: number) => {
    onSelect(selectedYear === year ? undefined : year);
  };

  return (
    <YStack gap="$1">
      <Typography variant="callout">년도</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$1">
          {years.map((year) => (
            <Button
              key={year}
              backgroundColor={selectedYear === year ? '$primary' : '$surface'}
              borderRadius="$2"
              color={selectedYear === year ? '$textOnPrimary' : '$textSecondary'}
              height={32}
              justifyContent="center"
              paddingHorizontal="$1"
              onPress={() => handlePress(year)}
            >
              {year}년
            </Button>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
