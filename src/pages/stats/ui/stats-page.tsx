import { ScrollView, YStack } from 'tamagui';
import { categoryStatsQuery, overallStatsQuery } from '~/entities/statistics';
import { CategoryStatsView, OverallStatsView } from '~/entities/statistics/ui/statistics/ui';
import { Loading, Typography } from '~/shared/ui';

import { useQuery } from '@tanstack/react-query';

export function StatsPage() {
  const {
    data: overallStats,
    isLoading: overallLoading,
    error: overallError,
  } = useQuery(overallStatsQuery());

  const {
    data: categoryStats,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery(categoryStatsQuery());

  if (overallLoading || categoryLoading) {
    return <Loading text="통계 로딩 중..." />;
  }

  if (overallError || categoryError) {
    return (
      <YStack
        alignItems="center"
        backgroundColor="$backgroundPrimary"
        flex={1}
        gap="$3"
        justifyContent="center"
        padding="$3"
      >
        <Typography textAlign="center" variant="headline">
          통계 조회 실패
        </Typography>
        <Typography color="$textMuted" textAlign="center" variant="footnote">
          통계 데이터를 불러오는데 실패했습니다.{'\n'}잠시 후 다시 시도해주세요.
        </Typography>
      </YStack>
    );
  }

  return (
    <ScrollView backgroundColor="$backgroundSecondary" flex={1}>
      <YStack gap="$6" paddingHorizontal="$4" paddingTop="$4">
        {overallStats && <OverallStatsView stats={overallStats} />}

        {categoryStats && (
          <YStack gap="$3">
            <Typography paddingLeft="$3" variant="headline">
              카테고리별 통계
            </Typography>
            <CategoryStatsView categories={categoryStats} />
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
