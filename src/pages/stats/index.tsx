import { categoryStatsQuery, overallStatsQuery } from '~/entities/statistics';
import { CategoryStatsView, OverallStatsView } from '~/entities/statistics/ui/statistics/ui';
import { Loading, Typography } from '~/shared/ui';

import { ScrollView, View } from 'react-native';

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
      <View className="flex-1 items-center justify-center gap-3 bg-bg-primary p-3">
        <Typography className="text-center" variant="headline">
          통계 조회 실패
        </Typography>
        <Typography className="text-text-muted text-center" variant="footnote">
          통계 데이터를 불러오는데 실패했습니다.{'\n'}잠시 후 다시 시도해주세요.
        </Typography>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-bg-secondary">
      <View className="gap-6 px-4 pt-4">
        {overallStats && <OverallStatsView stats={overallStats} />}

        {categoryStats && (
          <View className="gap-3">
            <Typography className="pl-3" variant="headline">
              카테고리별 통계
            </Typography>
            <CategoryStatsView categories={categoryStats} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
