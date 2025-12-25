import { CategoryStatsResponseDto } from '~/entities/statistics';
import { Card, StarRating, Typography } from '~/shared/ui';

import { View } from 'react-native';

interface CategoryStatsViewProps {
  categories?: CategoryStatsResponseDto[];
}

export function CategoryStatsView({ categories }: CategoryStatsViewProps) {
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <View className="gap-1">
          <Typography className="text-text-muted text-center" variant="callout">
            카테고리별 통계 데이터가 없습니다.
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View>
        {categories?.map((category, index) => {
          const isLast = index === categories.length - 1;
          return (
            <View key={category.id} className="gap-2 p-2">
              <View className="flex-row items-center justify-between p-2">
                <Typography variant="subheadline">{category.name}</Typography>

                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-2">
                    <Typography variant="number">{category.count}</Typography>
                    <Typography variant="subheadline">개</Typography>
                  </View>
                  <StarRating rating={category.averageRating} />
                </View>
              </View>
              {!isLast && <View className="h-px bg-border" />}
            </View>
          );
        })}
      </View>
    </Card>
  );
}
