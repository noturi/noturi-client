import { ScrollView, YStack } from 'tamagui';
import { categoryStatsQuery, overallStatsQuery } from '~/features/statistics';
import { Loading, Typography } from '~/shared/ui';
import { CategoryStatsView, OverallStatsView } from '~/widgets/statistics';

import { useQuery } from '@tanstack/react-query';

export default function StatsScreen() {
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
        gap="$sm"
        justifyContent="center"
        padding="$sm"
      >
        <Typography color="$textPrimary" fontSize="$5" fontWeight="$5" textAlign="center">
          통계 조회 실패
        </Typography>
        <Typography color="$textMuted" fontSize="$3" textAlign="center">
          통계 데이터를 불러오는데 실패했습니다.{'\n'}잠시 후 다시 시도해주세요.
        </Typography>
      </YStack>
    );
  }

  return (
    <ScrollView backgroundColor="$backgroundSecondary" flex={1}>
      <YStack gap="$6" paddingHorizontal="$4">
        {overallStats && <OverallStatsView stats={overallStats} />}

        {categoryStats && (
          <YStack gap="$3">
            <Typography variant="subheading">카테고리별 통계</Typography>
            <CategoryStatsView categories={categoryStats} />
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
