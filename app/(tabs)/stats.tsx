import { Typography } from "@/components/ui";
import { BarChart3, BookOpen, Calendar, Star } from "@tamagui/lucide-icons";
import { ScrollView, XStack, YStack } from "tamagui";

export default function StatsScreen() {
  // 임시 통계 데이터
  const stats = {
    totalMemos: 124,
    thisMonth: 23,
    avgRating: 4.2,
    categories: [
      { name: "일상", count: 45, color: "#3B82F6" },
      { name: "업무", count: 32, color: "#10B981" },
      { name: "독서", count: 28, color: "#F59E0B" },
      { name: "여행", count: 19, color: "#EF4444" },
    ],
    streakDays: 7,
    lastMonthMemos: 18,
    mostActiveTime: "오후 2-4시",
    favoriteCategory: "일상",
  };

  // 개인화된 인사이트 생성
  const insights = [
    {
      icon: "📈",
      title: "기록 습관이 개선되고 있어요",
      description: `지난달 대비 ${((stats.thisMonth - stats.lastMonthMemos) / stats.lastMonthMemos * 100).toFixed(0)}% 더 많이 기록했어요`,
      type: "positive"
    },
    {
      icon: "🔥",
      title: `${stats.streakDays}일 연속 기록 중!`,
      description: "꾸준한 기록 습관을 유지하고 있어요",
      type: "streak"
    },
    {
      icon: "⭐",
      title: "높은 만족도를 유지하고 있어요",
      description: `평균 ${stats.avgRating}점으로 긍정적인 기록들이 많아요`,
      type: "rating"
    },
    {
      icon: "🎯",
      title: `${stats.favoriteCategory} 카테고리를 가장 자주 사용해요`,
      description: `전체 기록의 ${((stats.categories.find(c => c.name === stats.favoriteCategory)?.count || 0) / stats.totalMemos * 100).toFixed(0)}%를 차지하고 있어요`,
      type: "category"
    },
    {
      icon: "⏰",
      title: `${stats.mostActiveTime}에 가장 활발해요`,
      description: "이 시간대에 가장 많은 기록을 남기시네요",
      type: "time"
    }
  ];

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$6">
          {/* 전체 통계 카드들 */}
          <YStack gap="$4">
            <Typography variant="heading" color="$textPrimary" fontWeight="$6">
              나의 기록 통계
            </Typography>
            
            <XStack gap="$3">
              {/* 총 메모 수 */}
              <YStack
                flex={1}
                backgroundColor="$surface"
                borderRadius="$4"
                padding="$4"
                alignItems="center"
                gap="$2"
              >
                <BookOpen size={24} color="$accent" />
                <Typography variant="title" color="$textPrimary" fontWeight="$6">
                  {stats.totalMemos}
                </Typography>
                <Typography variant="caption" color="$textMuted" textAlign="center">
                  총 메모
                </Typography>
              </YStack>

              {/* 이번 달 메모 */}
              <YStack
                flex={1}
                backgroundColor="$surface"
                borderRadius="$4"
                padding="$4"
                alignItems="center"
                gap="$2"
              >
                <Calendar size={24} color="$accent" />
                <Typography variant="title" color="$textPrimary" fontWeight="$6">
                  {stats.thisMonth}
                </Typography>
                <Typography variant="caption" color="$textMuted" textAlign="center">
                  이번 달
                </Typography>
              </YStack>
            </XStack>

            <XStack gap="$3">
              {/* 평균 평점 */}
              <YStack
                flex={1}
                backgroundColor="$surface"
                borderRadius="$4"
                padding="$4"
                alignItems="center"
                gap="$2"
              >
                <Star size={24} color="$accent" />
                <Typography variant="title" color="$textPrimary" fontWeight="$6">
                  {stats.avgRating}
                </Typography>
                <Typography variant="caption" color="$textMuted" textAlign="center">
                  평균 평점
                </Typography>
              </YStack>

              {/* 활성 카테고리 */}
              <YStack
                flex={1}
                backgroundColor="$surface"
                borderRadius="$4"
                padding="$4"
                alignItems="center"
                gap="$2"
              >
                <BarChart3 size={24} color="$accent" />
                <Typography variant="title" color="$textPrimary" fontWeight="$6">
                  {stats.categories.length}
                </Typography>
                <Typography variant="caption" color="$textMuted" textAlign="center">
                  카테고리
                </Typography>
              </YStack>
            </XStack>
          </YStack>

          {/* 카테고리별 통계 */}
          <YStack gap="$4">
            <Typography variant="title" color="$textPrimary" fontWeight="$6">
              카테고리별 메모 수
            </Typography>
            
            <YStack gap="$3">
              {stats.categories.map((category, index) => (
                <YStack key={category.name} gap="$2">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Typography variant="body" color="$textPrimary">
                      {category.name}
                    </Typography>
                    <Typography variant="body" color="$textSecondary" fontWeight="$6">
                      {category.count}개
                    </Typography>
                  </XStack>
                  
                  {/* 프로그레스 바 */}
                  <YStack
                    height={8}
                    backgroundColor="$backgroundSecondary"
                    borderRadius="$2"
                    overflow="hidden"
                  >
                    <YStack
                      height={20}
                      backgroundColor={category.color as any}
                      width={`${(category.count / stats.totalMemos) * 100}%` as any}
                      borderRadius="$2"
                    />
                  </YStack>
                </YStack>
              ))}
            </YStack>
          </YStack>

          {/* 최근 활동 요약 */}
          <YStack gap="$4">
            <Typography variant="title" color="$textPrimary" fontWeight="$6">
              최근 활동
            </Typography>
            
            <YStack
              backgroundColor="$surface"
              borderRadius="$4"
              padding="$4"
              alignItems="center"
              justifyContent="center"
              minHeight={100}
            >
              <Typography variant="body" color="$textSecondary" textAlign="center">
                지난 7일간의 기록 활동
              </Typography>
              <Typography variant="caption" color="$textMuted" textAlign="center" marginTop="$1">
                데이터 시각화 준비 중
              </Typography>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}