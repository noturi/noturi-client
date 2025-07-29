import { Typography } from "@/components/ui";
import { useAuth } from "@/context/auth";
import {
  BarChart3,
  Home,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
} from "@tamagui/lucide-icons";
import { Redirect, Tabs, router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import {
  Button,
  Input,
  ScrollView,
  Sheet,
  Spinner,
  TextArea,
  XStack,
  YStack,
} from "tamagui";

export default function TabsLayout() {
  const { isAuthenticated, isInitialLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [memoContent, setMemoContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const categories = ["일상", "업무", "학습", "운동", "독서"];

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = rating >= i;
      const isHalfFilled = rating === i - 0.5;

      stars.push(
        <XStack key={i} alignItems="center">
          {/* 왼쪽 반쪽 (0.5점) */}
          <Pressable
            onPress={() => setRating(i - 0.5)}
            style={{ padding: 2, width: 12, height: 24, overflow: "hidden" }}
          >
            <Star
              size={24}
              color={isFilled || isHalfFilled ? "$warning" : "$border"}
              fill={isFilled || isHalfFilled ? "$warning" : "transparent"}
              style={{ marginLeft: 0 }}
            />
          </Pressable>
          {/* 오른쪽 반쪽 (1점) */}
          <Pressable
            onPress={() => setRating(i)}
            style={{ padding: 2, width: 12, height: 24, overflow: "hidden" }}
          >
            <Star
              size={24}
              color={isFilled ? "$warning" : "$border"}
              fill={isFilled ? "$warning" : "transparent"}
              style={{ marginLeft: -12 }}
            />
          </Pressable>
        </XStack>
      );
    }
    return stars;
  };

  if (isInitialLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const handleCreateMemo = () => {
    console.log("handleCreateMemo called");
    setIsSheetOpen(true);
  };

  const handleSaveMemo = () => {
    // TODO: 메모 저장 로직 구현
    console.log("Saving memo:", {
      content: memoContent,
      category: selectedCategory || newCategory,
      rating,
      description,
    });
    setMemoContent("");
    setSelectedCategory("");
    setNewCategory("");
    setRating(0);
    setDescription("");
    setIsSheetOpen(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#111827",
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 16,
          },
          headerShadowVisible: false,
          headerTitleAlign: "left",
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#0066CC",
          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        {/* 홈 - 기록 보기 */}
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <Home size={22} color={color as any} />,
            headerRight: () => (
              <XStack paddingRight="$3">
                <Pressable
                  onPress={() => router.push("/search")}
                  style={{ padding: 8 }}
                >
                  <Search size={20} />
                </Pressable>
              </XStack>
            ),
          }}
        />

        <Tabs.Screen
          name="threads"
          options={{
            title: "메모 추가",
            tabBarIcon: ({ color }) => (
              <MessageSquare size={22} color={color as any} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "",
            tabBarIcon: ({ color }) => <Plus size={22} color={color as any} />,
            headerShown: false,
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              console.log("Tab pressed!");
              e.preventDefault();
              handleCreateMemo();
            },
          })}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "프로필",
            tabBarIcon: ({ color }) => (
              <BarChart3 size={22} color={color as any} />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => router.push("/profile")}
                style={{ padding: 8, marginRight: 12 }}
              >
                <Settings size={20} />
              </Pressable>
            ),
          }}
        />
      </Tabs>

      {/* 바텀시트 */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        snapPoints={[85, 50]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        modal
        animation="quick"
      >
        <Sheet.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="$backgroundOverlay"
        />
        <Sheet.Handle backgroundColor="$textPrimary" />
        <Sheet.Frame
          padding="$0"
          justifyContent="flex-start"
          backgroundColor="$background"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          borderTopWidth={1}
          borderLeftWidth={1}
          borderRightWidth={1}
          borderColor="$border"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack padding="$4" gap="$4">
              {/* 헤더 */}
              <XStack justifyContent="space-between" alignItems="center">
                <Typography variant="heading" color="$textPrimary">
                  새 기록
                </Typography>
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={() => setIsSheetOpen(false)}
                  color="$textSecondary"
                >
                  취소
                </Button>
              </XStack>

              {/* 메모 내용 */}
              <YStack gap="$2">
                <TextArea
                  placeholder="무엇을 기록하고 싶나요?"
                  value={memoContent}
                  onChangeText={setMemoContent}
                  minHeight={100}
                  borderRadius="$4"
                  backgroundColor="$background"
                  borderColor="$border"
                  borderWidth={1}
                  fontSize="$4"
                  multiline
                />
              </YStack>

              {/* 카테고리 선택 */}
              <YStack gap="$2">
                <Typography variant="subtitle" color="$textPrimary">
                  카테고리
                </Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2" paddingRight="$4">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        size="$3"
                        backgroundColor={
                          selectedCategory === category
                            ? "$textPrimary"
                            : "$background"
                        }
                        borderWidth={1}
                        borderColor={
                          selectedCategory === category
                            ? "$textPrimary"
                            : "$border"
                        }
                        color={
                          selectedCategory === category
                            ? "$background"
                            : "$textSecondary"
                        }
                        onPress={() => {
                          setSelectedCategory(category);
                          setNewCategory("");
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                    <Button
                      size="$3"
                      backgroundColor="$background"
                      borderWidth={1}
                      borderColor="$border"
                      borderStyle="dashed"
                      color="$textSecondary"
                      onPress={() => {
                        setSelectedCategory("");
                        // Focus on new category input
                      }}
                    >
                      + 추가
                    </Button>
                  </XStack>
                </ScrollView>

                {!selectedCategory && (
                  <Input
                    placeholder="새 카테고리 입력"
                    value={newCategory}
                    onChangeText={setNewCategory}
                    borderRadius="$3"
                    backgroundColor="$background"
                    borderColor="$border"
                    fontSize="$3"
                  />
                )}
              </YStack>

              {/* 별점 */}
              <YStack gap="$2">
                <Typography variant="subtitle" color="$textPrimary">
                  평점
                </Typography>
                <XStack alignItems="center" gap="$1">
                  {renderStars()}
                  <Typography
                    variant="caption"
                    color="$textSecondary"
                    marginLeft="$2"
                  >
                    {rating > 0 ? `${rating}/5` : "평점을 선택하세요"}
                  </Typography>
                </XStack>
              </YStack>

              {/* 설명 */}
              <YStack gap="$2">
                <Typography variant="subtitle" color="$textPrimary">
                  추가 설명
                </Typography>
                <TextArea
                  placeholder="자세한 설명을 추가해보세요 (선택사항)"
                  value={description}
                  onChangeText={setDescription}
                  minHeight={80}
                  borderRadius="$4"
                  backgroundColor="$background"
                  borderColor="$border"
                  borderWidth={1}
                  fontSize="$3"
                  multiline
                />
              </YStack>

              {/* 등록 버튼 */}
              <Button
                backgroundColor="$primary"
                borderRadius="$4"
                height="$4"
                fontSize="$4"
                fontWeight="600"
                marginTop="$2"
                onPress={handleSaveMemo}
                disabled={!memoContent.trim()}
                opacity={!memoContent.trim() ? 0.5 : 1}
              >
                등록
              </Button>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
