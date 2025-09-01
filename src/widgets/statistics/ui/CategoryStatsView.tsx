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
        <YStack gap="$4">
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
            <YStack key={category.id} padding="$sm">
              <XStack alignItems="center" justifyContent="space-between" padding="$sm">
                <Typography color="$textPrimary" fontWeight="$semibold" variant="body1">
                  {category.categoryName}
                </Typography>

                <XStack alignItems="center" gap="$lg">
                  <Typography fontWeight="$semibold" variant="subtitle">
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
