import { Separator, XStack, YStack } from 'tamagui';
import { CategoryStatsResponseDto } from '~/entities/statistics';
import { Card, StarRating, Typography } from '~/shared/ui';

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
                <Typography color="$textPrimary">{category.name}</Typography>

                <XStack alignItems="center" gap="$4">
                  <Typography variant="callout">{category.count}개</Typography>
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
