import { XStack, YStack } from 'tamagui';
import { OverallStats } from '~/entities/statistics';
import { Card, Typography } from '~/shared/ui';

interface OverallStatsViewProps {
  stats: OverallStats;
}

export function OverallStatsView({ stats }: OverallStatsViewProps) {
  if (!stats) return null;

  return (
    <XStack gap="$lg">
      <Card>
        <YStack alignItems="center" flex={1} gap="$sm" padding="$sm">
          <Typography variant="title">{stats.totalMemos ?? 0}</Typography>
          <Typography variant="caption1">총 메모</Typography>
        </YStack>
      </Card>

      <Card>
        <YStack alignItems="center" flex={1} gap="$sm" padding="$sm">
          <Typography variant="title">{(stats.avgRating ?? 0).toFixed(1)}</Typography>
          <Typography variant="caption1">평균 별점</Typography>
        </YStack>
      </Card>

      <Card>
        <YStack alignItems="center" flex={1} gap="$sm" padding="$sm">
          <Typography variant="title">{stats.totalCategories ?? 0}</Typography>
          <Typography variant="caption1">카테고리</Typography>
        </YStack>
      </Card>

      <Card>
        <YStack alignItems="center" flex={1} gap="$sm" padding="$sm">
          <Typography variant="title">{stats.recommendedExperiences ?? 0}</Typography>
          <Typography variant="caption1">추천 경험</Typography>
        </YStack>
      </Card>
    </XStack>
  );
}
