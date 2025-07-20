import { Button, Typography } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Card, ScrollView, XStack, YStack } from "tamagui";

const categories = [
  { name: "전체", count: 24, active: false },
  { name: "일상", count: 8, active: true },
  { name: "업무", count: 6, active: false },
  { name: "독서", count: 5, active: false },
  { name: "여행", count: 3, active: false },
];

const sortOptions = [
  { name: "최신순", active: true },
  { name: "별점순", active: false },
  { name: "제목순", active: false },
];

const memoList = [
  {
    id: 1,
    title: "오늘의 할 일",
    category: "일상",
    content:
      "장보기, 운동하기, 책 읽기. 특히 운동은 꼭 해야겠다. 요즘 너무 앉아만 있어서 몸이 무거워지는 느낌이다.",
    rating: 3,
    timeAgo: "2시간 전",
  },
  {
    id: 2,
    title: "노투리 앱 개발 아이디어",
    category: "업무",
    content:
      "React Native + Expo로 메모앱 만들기. 백엔드는 Node.js + Prisma 사용. 디자인은 심플하지만 깔끔하게 가고 싶다.",
    rating: 5,
    timeAgo: "6시간 전",
  },
  {
    id: 3,
    title: "독서 노트 - 클린 코드",
    category: "독서",
    content:
      "함수는 한 가지 일만 해야 한다. 네이밍은 의도를 명확히 드러내야 한다. 주석보다는 코드로 설명하자.",
    rating: 4,
    timeAgo: "1일 전",
  },
  {
    id: 4,
    title: "부산 여행 계획",
    category: "여행",
    content:
      "광안리 해변, 해운대, 감천문화마을 방문 예정. 돼지국밥과 밀면은 꼭 먹어봐야겠다.",
    rating: 4,
    timeAgo: "3일 전",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <XStack space="$0.25">
    {[...Array(5)].map((_, i) => (
      <Typography
        key={i}
        variant="caption"
        color={i < rating ? "$warning" : "$textMuted"}
      >
        ⭐
      </Typography>
    ))}
  </XStack>
);

const CategoryButton = ({
  category,
}: {
  category: { name: string; count: number; active: boolean };
}) => (
  <YStack
    backgroundColor={category.active ? "$textPrimary" : "$surface"}
    paddingHorizontal="$3"
    paddingVertical="$1.5"
    borderRadius="$5"
    alignItems="center"
    minWidth="$10"
    borderWidth={1}
    borderColor={category.active ? "$textPrimary" : "$border"}
    pressStyle={{
      scale: 0.95,
      backgroundColor: category.active ? "$primaryActive" : "$surfaceHover",
    }}
  >
    <Typography
      variant="small"
      fontWeight="$3"
      color={category.active ? "$textOnPrimary" : "$textSecondary"}
    >
      {category.name}
    </Typography>
    <Typography
      variant="title"
      fontWeight="$4"
      color={category.active ? "$textOnPrimary" : "$textPrimary"}
    >
      {category.count}
    </Typography>
  </YStack>
);

const SortButton = ({
  option,
}: {
  option: { name: string; active: boolean };
}) => (
  <Button
    size="sm"
    variant={option.active ? undefined : "outlined"}
    chromeless={!option.active}
  >
    <Typography
      variant="caption"
      color={option.active ? "$textOnPrimary" : "$textSecondary"}
      fontWeight={option.active ? "$3" : "$2"}
    >
      {option.name}
    </Typography>
  </Button>
);

const MemoCard = ({ memo }: { memo: (typeof memoList)[0] }) => (
  <Card
    padding="$3"
    backgroundColor="$surface"
    borderRadius="$2"
    borderColor="$border"
    borderWidth={0.5}
    shadowColor="$shadowColor"
    shadowOffset={{ width: 0, height: 1 }}
    shadowOpacity={0.02}
    shadowRadius={2}
    elevation={1}
    pressStyle={{
      scale: 0.98,
      backgroundColor: "$surfaceHover",
    }}
  >
    <XStack
      justifyContent="space-between"
      alignItems="flex-start"
      marginBottom="$1.5"
    >
      <YStack flex={1}>
        <Typography
          as="h4"
          variant="title"
          color="$textPrimary"
          marginBottom="$0.5"
        >
          {memo.title}
        </Typography>
        <Typography
          as="span"
          variant="caption"
          color="$accent"
          marginBottom="$2"
        >
          #{memo.category}
        </Typography>
      </YStack>
      <XStack alignItems="center" space="$1.5">
        <Typography as="span" variant="caption" color="$textMuted">
          {memo.timeAgo}
        </Typography>
        <StarRating rating={memo.rating} />
        <Button size="sm" chromeless>
          <Ionicons name="ellipsis-vertical" size={12} color="$textSecondary" />
        </Button>
      </XStack>
    </XStack>

    <Typography as="p" variant="body" color="$textSecondary" numberOfLines={2}>
      {memo.content}
    </Typography>
  </Card>
);

export default function HomeScreen() {
  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack paddingHorizontal="$4" paddingBottom="$3" space="$1.5">
          {categories.map((category) => (
            <CategoryButton key={category.name} category={category} />
          ))}
        </XStack>
      </ScrollView>

      {/* Sort Options */}
      <XStack paddingHorizontal="$4" paddingBottom="$3" space="$1.5">
        {sortOptions.map((option) => (
          <SortButton key={option.name} option={option} />
        ))}
      </XStack>

      {/* Memo List */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" space="$2" paddingBottom="$6">
          {memoList.map((memo) => (
            <MemoCard key={memo.id} memo={memo} />
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
