import { STAR_COLOR } from '~/shared/config';
import { Star } from '~/shared/lib/icons';
import { StatCard, Typography } from '~/shared/ui';

import { View } from 'react-native';

import type { OverallStatsResponseDto } from '../../../model/types';

interface OverallStatsViewProps {
  stats: OverallStatsResponseDto;
}

export function OverallStatsView({ stats }: OverallStatsViewProps) {
  if (!stats) return null;

  return (
    <View className="flex-row gap-4">
      <StatCard label="총 메모">
        <Typography variant="number">{stats.totalMemos ?? 0}</Typography>
      </StatCard>

      {/* 별점 칩(StarRating)은 자체 여백이 있어 카드 높이가 달라지므로 아이콘+숫자로 표시 */}
      <StatCard label="평균 별점">
        <View className="flex-row items-center gap-1">
          <Star color={STAR_COLOR} fill={STAR_COLOR} size={12} />
          <Typography variant="number">{(stats.averageRating ?? 0).toFixed(1)}</Typography>
        </View>
      </StatCard>

      <StatCard label="카테고리">
        <Typography variant="number">{stats.totalCategories ?? 0}</Typography>
      </StatCard>
    </View>
  );
}
