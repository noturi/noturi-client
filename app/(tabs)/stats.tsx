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

  // 개인화 인사이트는 후에 데이터 연동 시 표시 예정

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
                <Typography
                  variant="title"
                  color="$textPrimary"
                  fontWeight="$6"
                >
                  {stats.totalMemos}
                </Typography>
                <Typography
                  variant="caption"
                  color="$textMuted"
                  textAlign="center"
                >
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
                <Typography
                  variant="title"
                  color="$textPrimary"
                  fontWeight="$6"
                >
                  {stats.thisMonth}
                </Typography>
                <Typography
                  variant="caption"
                  color="$textMuted"
                  textAlign="center"
                >
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
                <Typography
                  variant="title"
                  color="$textPrimary"
                  fontWeight="$6"
                >
                  {stats.avgRating}
                </Typography>
                <Typography
                  variant="caption"
                  color="$textMuted"
                  textAlign="center"
                >
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
                <Typography
                  variant="title"
                  color="$textPrimary"
                  fontWeight="$6"
                >
                  {stats.categories.length}
                </Typography>
                <Typography
                  variant="caption"
                  color="$textMuted"
                  textAlign="center"
                >
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
                    <Typography
                      variant="body"
                      color="$textSecondary"
                      fontWeight="$6"
                    >
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
                      width={
                        `${(category.count / stats.totalMemos) * 100}%` as any
                      }
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
              <Typography
                variant="body"
                color="$textSecondary"
                textAlign="center"
              >
                지난 7일간의 기록 활동
              </Typography>
              <Typography
                variant="caption"
                color="$textMuted"
                textAlign="center"
                marginTop="$1"
              >
                데이터 시각화 준비 중
              </Typography>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
