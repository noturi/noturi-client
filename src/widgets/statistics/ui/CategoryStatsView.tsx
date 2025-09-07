import { Separator, XStack, YStack } from 'tamagui';
import { CategoryStatsResponse } from '~/entities/statistics';
import { Card, StarRating, Typography } from '~/shared/ui';

interface CategoryStatsViewProps {
  categories?: CategoryStatsResponse[];
}

export function CategoryStatsView({ categories }: CategoryStatsViewProps) {
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <YStack gap="$1">
          <Typography color="$textMuted" textAlign="center" variant="body2">
            카테고리별 통계 데이터가 없습니다.
          </Typography>
        </YStack>
      </Card>
    );
  }

  return (
    <Card>
      <YStack>
        {categories?.map((category) => {
          return (
            <YStack key={category.id} padding="$2">
              <XStack alignItems="center" justifyContent="space-between" padding="$2">
                <Typography color="$textPrimary" fontWeight="$5" variant="body1">
                  {category.categoryName}
                </Typography>

                <XStack alignItems="center" gap="$4">
                  <Typography fontWeight="$5" variant="subtitle">
                    {category.count}개
                  </Typography>
                  <StarRating rating={category.avgRating} />
                </XStack>
              </XStack>
              <Separator borderColor="$border" />
            </YStack>
          );
        })}
      </YStack>
    </Card>
  );
}
