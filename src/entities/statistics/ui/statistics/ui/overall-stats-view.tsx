import { XStack } from 'tamagui';
import { OverallStatsResponseDto } from '~/entities/statistics';
import { Card, Typography } from '~/shared/ui';
import { StarRating } from '~/shared/ui';

interface OverallStatsViewProps {
  stats: OverallStatsResponseDto;
}

export function OverallStatsView({ stats }: OverallStatsViewProps) {
  if (!stats) return null;

  return (
    <XStack gap="$4">
      <Card>
        <XStack alignItems="center" flex={1} gap="$2" paddingHorizontal="$2">
          <Typography variant="footnote">총 메모</Typography>
          <Typography variant="number">{stats.totalMemos ?? 0}</Typography>
        </XStack>
      </Card>

      <Card>
        <XStack alignItems="center" flex={1} gap="$2" paddingHorizontal="$2">
          <Typography variant="footnote">평균 별점</Typography>
          <StarRating rating={stats.averageRating ?? 0} />
        </XStack>
      </Card>

      <Card>
        <XStack alignItems="center" flex={1} gap="$2" paddingHorizontal="$2">
          <Typography variant="footnote">카테고리</Typography>
          <Typography variant="number">{stats.totalCategories ?? 0}</Typography>
        </XStack>
      </Card>

      {/* <Card>
        <YStack alignItems="flex" flex={1} gap="$2" padding="$2">
          <Typography variant="title">{stats.recommendedExperiences ?? 0}</Typography>
          <Typography variant="headline">추천 경험</Typography>
        </YStack>
      </Card> */}
    </XStack>
  );
}
