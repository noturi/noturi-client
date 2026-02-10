import { categoryStatsQuery, overallStatsQuery } from '~/entities/statistics';
import { CategoryStatsView, OverallStatsView } from '~/entities/statistics/ui/statistics/ui';
import {
  todoGrassStatsQuery,
  todoOverviewStatsQuery,
  todoWeeklyStatsQuery,
} from '~/entities/todo/api/queries';
import { GrassChart } from '~/entities/todo/ui';
import { Card, Loading, SegmentControl, Typography } from '~/shared/ui';

import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useQuery } from '@tanstack/react-query';

type StatsTab = 'memo' | 'todo';

const TAB_OPTIONS: { value: StatsTab; label: string }[] = [
  { value: 'memo', label: '별점 메모' },
  { value: 'todo', label: '할일 메모' },
];

export function StatsPage() {
  const [activeTab, setActiveTab] = useState<StatsTab>('memo');

  const isTodoTab = activeTab === 'todo';
  const isMemoTab = activeTab === 'memo';

  const {
    data: overallStats,
    isLoading: overallLoading,
    error: overallError,
  } = useQuery({ ...overallStatsQuery(), enabled: isMemoTab });

  const {
    data: categoryStats,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({ ...categoryStatsQuery(), enabled: isMemoTab });

  const {
    data: grassStats,
    isLoading: grassLoading,
    error: grassError,
  } = useQuery({ ...todoGrassStatsQuery(), enabled: isTodoTab });

  const {
    data: overviewStats,
    isLoading: overviewLoading,
    error: overviewError,
  } = useQuery({ ...todoOverviewStatsQuery(), enabled: isTodoTab });

  const {
    data: weeklyStats,
    isLoading: weeklyLoading,
    error: weeklyError,
  } = useQuery({ ...todoWeeklyStatsQuery(), enabled: isTodoTab });

  const isMemoLoading = isMemoTab && (overallLoading || categoryLoading);
  const isTodoLoading = isTodoTab && (grassLoading || overviewLoading || weeklyLoading);
  const isMemoError = isMemoTab && (overallError || categoryError);
  const isTodoError = isTodoTab && (grassError || overviewError || weeklyError);

  return (
    <ScrollView className="flex-1 bg-bg-secondary" contentInsetAdjustmentBehavior="never">
      <View className="gap-6 px-4 pt-4">
        <SegmentControl options={TAB_OPTIONS} value={activeTab} onChange={setActiveTab} />

        {(isMemoLoading || isTodoLoading) && <Loading text="통계 로딩 중..." />}

        {(isMemoError || isTodoError) && (
          <View className="items-center justify-center gap-3 p-3">
            <Typography className="text-center" variant="headline">
              통계 조회 실패
            </Typography>
            <Typography className="text-text-muted text-center" variant="footnote">
              통계 데이터를 불러오는데 실패했습니다.{'\n'}잠시 후 다시 시도해주세요.
            </Typography>
          </View>
        )}

        {isMemoTab && !isMemoLoading && !isMemoError && (
          <>
            {overallStats && <OverallStatsView stats={overallStats} />}
            {categoryStats && (
              <View className="gap-3">
                <Typography className="pl-3" variant="headline">
                  카테고리별 통계
                </Typography>
                <CategoryStatsView categories={categoryStats} />
              </View>
            )}
          </>
        )}

        {isTodoTab && !isTodoLoading && !isTodoError && (
          <>
            {overviewStats && weeklyStats && (
              <View className="flex-row gap-4">
                <Card>
                  <View className="flex-row items-center flex-1 gap-2 px-2">
                    <Typography variant="footnote">최다 연속</Typography>
                    <Typography variant="number">{overviewStats.bestStreak}일</Typography>
                  </View>
                </Card>

                <Card>
                  <View className="flex-row items-center flex-1 gap-2 px-2">
                    <Typography variant="footnote">이번 주 달성률</Typography>
                    <Typography variant="number">{weeklyStats.rate}%</Typography>
                  </View>
                </Card>
              </View>
            )}

            {grassStats && <GrassChart data={grassStats.data} />}
          </>
        )}
      </View>
    </ScrollView>
  );
}
