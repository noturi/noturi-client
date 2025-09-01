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

  // 디버깅 로그
  console.log('Stats Debug:', {
    overallStats,
    categoryStats,
    overallLoading,
    categoryLoading,
    overallError,
    categoryError,
  });

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
        <Typography color="$textPrimary" fontSize="$xl" fontWeight="$semibold" textAlign="center">
          통계 조회 실패
        </Typography>
        <Typography color="$textMuted" fontSize="$md" textAlign="center">
          통계 데이터를 불러오는데 실패했습니다.{'\n'}잠시 후 다시 시도해주세요.
        </Typography>
      </YStack>
    );
  }

  return (
    <ScrollView backgroundColor="$backgroundSecondary" flex={1}>
      <YStack gap="$2xl" paddingHorizontal="$lg">
        {overallStats && (
          <YStack gap="$md">
            <OverallStatsView stats={overallStats} />
          </YStack>
        )}

        {categoryStats && (
          <YStack gap="$md">
            <Typography paddingLeft="$md" variant="subheading">
              카테고리별 통계
            </Typography>
            <CategoryStatsView categories={categoryStats} />
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}
