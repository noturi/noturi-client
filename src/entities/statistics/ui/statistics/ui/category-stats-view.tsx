import { Separator, XStack, YStack } from 'tamagui';
import { CategoryStatsResponseDto } from '~/entities/statistics';
import { Card, Typography } from '~/shared/ui';
import { StarRating } from '~/widgets';

interface CategoryStatsViewProps {
  categories?: CategoryStatsResponseDto[];
}

export function CategoryStatsView({ categories }: CategoryStatsViewProps) {
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <YStack gap="$1">
          <Typography color="$textMuted" textAlign="center" variant="callout">
            카테고리별 통계 데이터가 없습니다.
          </Typography>
        </YStack>
      </Card>
    );
  }

  return (
    <Card>
      <YStack>
        {categories?.map((category, index) => {
          const isLast = index === categories.length - 1;
          return (
            <YStack key={category.id} gap="$2" padding="$2">
              <XStack alignItems="center" justifyContent="space-between" padding="$2">
                <Typography variant="subheadline">{category.name}</Typography>

                <XStack alignItems="center" gap="$4">
                  <XStack alignItems="center" gap="$2">
                    <Typography variant="number">{category.count}</Typography>
                    <Typography variant="subheadline">개</Typography>
                  </XStack>
                  <StarRating rating={category.averageRating} />
                </XStack>
              </XStack>
              {!isLast && <Separator borderColor="$border" />}
            </YStack>
          );
        })}
      </YStack>
    </Card>
  );
}
