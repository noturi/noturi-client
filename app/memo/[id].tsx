import { Typography } from "@/components/ui";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, XStack, YStack } from "tamagui";
import { StarRating } from "@/components/memo/StarRating";

// 임시 데이터 - 실제로는 API나 상태 관리에서 가져와야 함
const memoData = {
  1: {
    id: 1,
    title: "오늘의 할 일",
    category: "일상",
    content:
      "장보기, 운동하기, 책 읽기. 특히 운동은 꼭 해야겠다. 요즘 너무 앉아만 있어서 몸이 무거워지는 느낌이다. 내일부터는 아침에 30분씩이라도 산책을 하려고 한다.",
    rating: 3,
    timeAgo: "2시간 전",
    createdAt: "2024-01-15 14:30",
  },
  2: {
    id: 2,
    title: "노투리 앱 개발 아이디어",
    category: "업무",
    content:
      "React Native + Expo로 메모앱 만들기. 백엔드는 Node.js + Prisma 사용. 디자인은 심플하지만 깔끔하게 가고 싶다. 타마구이를 사용해서 일관된 디자인 시스템을 구축하자.",
    rating: 5,
    timeAgo: "6시간 전",
    createdAt: "2024-01-15 10:15",
  },
  3: {
    id: 3,
    title: "독서 노트 - 클린 코드",
    category: "독서",
    content:
      "함수는 한 가지 일만 해야 한다. 네이밍은 의도를 명확히 드러내야 한다. 주석보다는 코드로 설명하자. 가독성이 좋은 코드가 유지보수하기 쉬운 코드다.",
    rating: 4,
    timeAgo: "1일 전",
    createdAt: "2024-01-14 20:45",
  },
  4: {
    id: 4,
    title: "부산 여행 계획",
    category: "여행",
    content:
      "광안리 해변, 해운대, 감천문화마을 방문 예정. 돼지국밥과 밀면은 꼭 먹어봐야겠다. 자갈치시장도 가서 회도 먹어보자.",
    rating: 4,
    timeAgo: "3일 전",
    createdAt: "2024-01-12 16:20",
  },
};

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams();
  const memoId = parseInt(id as string);
  const memo = memoData[memoId as keyof typeof memoData];

  if (!memo) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$backgroundPrimary">
        <Typography variant="title" color="$textPrimary">
          메모를 찾을 수 없습니다
        </Typography>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          {/* 헤더 정보 */}
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <XStack alignItems="center" gap="$2" flex={1}>
                <Typography
                  variant="caption"
                  color="$textPrimary"
                  fontWeight="$3"
                >
                  #{memo.category}
                </Typography>
                <Typography variant="caption" color="$textMuted">
                  {memo.timeAgo}
                </Typography>
              </XStack>
              <StarRating rating={memo.rating} />
            </XStack>
            
            <Typography
              variant="heading"
              color="$textPrimary"
              fontWeight="$6"
              lineHeight="$2"
            >
              {memo.title}
            </Typography>
          </YStack>

          {/* 메모 내용 */}
          <YStack gap="$3">
            <Typography
              variant="body"
              color="$textSecondary"
              lineHeight="$4"
              fontSize="$4"
            >
              {memo.content}
            </Typography>
          </YStack>

          {/* 메타 정보 */}
          <YStack gap="$2" paddingTop="$4" borderTopWidth={1} borderTopColor="$border">
            <Typography variant="caption" color="$textMuted">
              작성일: {memo.createdAt}
            </Typography>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}