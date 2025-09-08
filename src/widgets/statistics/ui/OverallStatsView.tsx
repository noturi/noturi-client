import { XStack, YStack } from 'tamagui';
import { OverallStatsResponseDto } from '~/entities/statistics';
import { Card, Typography } from '~/shared/ui';

interface OverallStatsViewProps {
  stats: OverallStatsResponseDto;
}

export function OverallStatsView({ stats }: OverallStatsViewProps) {
  if (!stats) return null;

  return (
    <XStack gap="$4">
      <Card>
        <YStack alignItems="center" flex={1} gap="$2" padding="$2">
          <Typography variant="title">{stats.totalMemos ?? 0}</Typography>
          <Typography variant="caption1">총 메모</Typography>
        </YStack>
      </Card>

      <Card>
        <YStack alignItems="center" flex={1} gap="$2" padding="$2">
          <Typography variant="title">{(stats.averageRating ?? 0).toFixed(1)}</Typography>
          <Typography variant="caption1">평균 별점</Typography>
        </YStack>
      </Card>

      <Card>
        <YStack alignItems="center" flex={1} gap="$2" padding="$2">
          <Typography variant="title">{stats.totalCategories ?? 0}</Typography>
          <Typography variant="caption1">카테고리</Typography>
        </YStack>
      </Card>

      {/* <Card>
        <YStack alignItems="center" flex={1} gap="$2" padding="$2">
          <Typography variant="title">{stats.recommendedExperiences ?? 0}</Typography>
          <Typography variant="caption1">추천 경험</Typography>
        </YStack>
      </Card> */}
    </XStack>
  );
}
