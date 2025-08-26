import { ScrollView, XStack, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { BarChart3, BookOpen, Calendar, Star } from '@tamagui/lucide-icons';

export default function StatsScreen() {
  // 임시 통계 데이터
  const stats = {
    totalMemos: 124,
    thisMonth: 23,
    avgRating: 4.2,
    categories: [
      { name: '일상', count: 45, color: '#3B82F6' },
      { name: '업무', count: 32, color: '#10B981' },
      { name: '독서', count: 28, color: '#F59E0B' },
      { name: '여행', count: 19, color: '#EF4444' },
    ],
    streakDays: 7,
    lastMonthMemos: 18,
    mostActiveTime: '오후 2-4시',
    favoriteCategory: '일상',
  };

  // 개인화 인사이트는 후에 데이터 연동 시 표시 예정

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$6" padding="$4">
          {/* 전체 통계 카드들 */}
          <YStack gap="$4">
            <Typography color="$textPrimary" fontWeight="$6" variant="heading">
              나의 기록 통계
            </Typography>

            <XStack gap="$3">
              {/* 총 메모 수 */}
              <YStack
                alignItems="center"
                backgroundColor="$surface"
                borderRadius="$4"
                flex={1}
                gap="$2"
                padding="$4"
              >
                <BookOpen color="$accent" size={24} />
                <Typography color="$textPrimary" fontWeight="$6" variant="title">
                  {stats.totalMemos}
                </Typography>
                <Typography color="$textMuted" textAlign="center" variant="caption2">
                  총 메모
                </Typography>
              </YStack>

              {/* 이번 달 메모 */}
              <YStack
                alignItems="center"
                backgroundColor="$surface"
                borderRadius="$4"
                flex={1}
                gap="$2"
                padding="$4"
              >
                <Calendar color="$accent" size={24} />
                <Typography color="$textPrimary" fontWeight="$6" variant="title">
                  {stats.thisMonth}
                </Typography>
                <Typography color="$textMuted" textAlign="center" variant="caption2">
                  이번 달
                </Typography>
              </YStack>
            </XStack>

            <XStack gap="$3">
              {/* 평균 평점 */}
              <YStack
                alignItems="center"
                backgroundColor="$surface"
                borderRadius="$4"
                flex={1}
                gap="$2"
                padding="$4"
              >
                <Star color="$accent" size={24} />
                <Typography color="$textPrimary" fontWeight="$6" variant="title">
                  {stats.avgRating}
                </Typography>
                <Typography color="$textMuted" textAlign="center" variant="caption2">
                  평균 평점
                </Typography>
              </YStack>

              {/* 활성 카테고리 */}
              <YStack
                alignItems="center"
                backgroundColor="$surface"
                borderRadius="$4"
                flex={1}
                gap="$2"
                padding="$4"
              >
                <BarChart3 color="$accent" size={24} />
                <Typography color="$textPrimary" fontWeight="$6" variant="title">
                  {stats.categories.length}
                </Typography>
                <Typography color="$textMuted" textAlign="center" variant="caption2">
                  카테고리
                </Typography>
              </YStack>
            </XStack>
          </YStack>

          {/* 카테고리별 통계 */}
          <YStack gap="$4">
            <Typography color="$textPrimary" fontWeight="$6" variant="title">
              카테고리별 메모 수
            </Typography>

            <YStack gap="$3">
              {stats.categories.map((category, index) => (
                <YStack key={category.name} gap="$2">
                  <XStack alignItems="center" justifyContent="space-between">
                    <Typography color="$textPrimary" variant="body1">
                      {category.name}
                    </Typography>
                    <Typography color="$textSecondary" fontWeight="$6" variant="body1">
                      {category.count}개
                    </Typography>
                  </XStack>

                  {/* 프로그레스 바 */}
                  <YStack
                    backgroundColor="$backgroundSecondary"
                    borderRadius="$2"
                    height={8}
                    overflow="hidden"
                  >
                    <YStack
                      backgroundColor={category.color as any}
                      borderRadius="$2"
                      height={20}
                      width={`${(category.count / stats.totalMemos) * 100}%` as any}
                    />
                  </YStack>
                </YStack>
              ))}
            </YStack>
          </YStack>

          {/* 최근 활동 요약 */}
          <YStack gap="$4">
            <Typography color="$textPrimary" fontWeight="$6" variant="title">
              최근 활동
            </Typography>

            <YStack
              alignItems="center"
              backgroundColor="$surface"
              borderRadius="$4"
              justifyContent="center"
              minHeight={100}
              padding="$4"
            >
              <Typography color="$textSecondary" textAlign="center" variant="body1">
                지난 7일간의 기록 활동
              </Typography>
              <Typography color="$textMuted" marginTop="$1" textAlign="center" variant="caption2">
                데이터 시각화 준비 중
              </Typography>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
