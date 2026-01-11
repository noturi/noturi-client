import { OverallStatsResponseDto } from '~/entities/statistics';
import { Card, StarRating, Typography } from '~/shared/ui';

import { View } from 'react-native';

interface OverallStatsViewProps {
  stats: OverallStatsResponseDto;
}

export function OverallStatsView({ stats }: OverallStatsViewProps) {
  if (!stats) return null;

  return (
    <View className="flex-row gap-4">
      <Card>
        <View className="flex-row items-center flex-1 gap-2 px-2">
          <Typography variant="footnote">총 메모</Typography>
          <Typography variant="number">{stats.totalMemos ?? 0}</Typography>
        </View>
      </Card>

      <Card>
        <View className="flex-row items-center flex-1 gap-2 px-2">
          <Typography variant="footnote">평균 별점</Typography>
          <StarRating rating={stats.averageRating ?? 0} />
        </View>
      </Card>

      <Card>
        <View className="flex-row items-center flex-1 gap-2 px-2">
          <Typography variant="footnote">카테고리</Typography>
          <Typography variant="number">{stats.totalCategories ?? 0}</Typography>
        </View>
      </Card>
    </View>
  );
}
