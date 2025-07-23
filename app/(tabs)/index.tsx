import { ScrollView, Separator, XStack, YStack } from "tamagui";
import { CategoryButton, MemoItem, SortButton, type Category, type Memo, type SortOption } from "./_components";

const categories: Category[] = [
  { name: "전체", count: 24, active: false },
  { name: "일상", count: 8, active: true },
  { name: "업무", count: 6, active: false },
  { name: "독서", count: 5, active: false },
  { name: "여행", count: 3, active: false },
];

const sortOptions: SortOption[] = [
  { name: "최신순", active: true },
  { name: "별점순", active: false },
  { name: "제목순", active: false },
];

const memoList: Memo[] = [
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

export default function HomeScreen() {
  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack paddingHorizontal="$4" paddingVertical="$2" space="$1.5">
          {categories.map((category) => (
            <CategoryButton key={category.name} category={category} />
          ))}
        </XStack>
      </ScrollView>

      <Separator borderColor="$border" />

      {/* Sort Options */}
      <XStack paddingHorizontal="$4" paddingVertical="$2" space="$1.5">
        {sortOptions.map((option) => (
          <SortButton key={option.name} option={option} />
        ))}
      </XStack>

      <Separator borderColor="$border" />

      {/* Memo List */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack paddingBottom="$6">
          {memoList.map((memo, index) => (
            <YStack key={memo.id}>
              <MemoItem memo={memo} />
              {index < memoList.length - 1 && (
                <Separator borderColor="$border" />
              )}
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
