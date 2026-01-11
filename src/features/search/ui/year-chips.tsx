import { Typography } from '~/shared/ui';

import { Pressable, ScrollView, View } from 'react-native';

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
    <View className="gap-1">
      <Typography variant="callout">년도</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-1">
          {years.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <Pressable
                key={year}
                className={`h-8 items-center justify-center rounded-2 px-3 ${
                  isSelected ? 'bg-primary' : 'bg-surface'
                }`}
                onPress={() => handlePress(year)}
              >
                <Typography
                  className={isSelected ? 'text-primary-text' : 'text-text-secondary'}
                  variant="callout"
                >
                  {year}년
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
