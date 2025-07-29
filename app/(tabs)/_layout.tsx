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
          flex={1}
          backgroundColor="white"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$0"
        >
          {/* Header */}
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="$5"
            paddingVertical="$4"
            borderBottomWidth={1}
            borderBottomColor="$border"
          >
            <Typography fontSize="$6" fontWeight="600" color="black">
              새 기록
            </Typography>
            <Button
              size="$3"
              backgroundColor="$surface"
              color="$textSecondary"
              pressStyle={{ backgroundColor: "$surfaceHover" }}
              borderRadius="$4"
              onPress={() => setIsSheetOpen(false)}
            >
              취소
            </Button>
          </XStack>

          {/* Content */}
          <YStack flex={1}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <YStack padding="$5" gap="$6">
                {/* Main Text Input */}
                <YStack gap="$3">
                  <TextArea
                    placeholder="무엇을 기록하고 싶나요?"
                    value={memoContent}
                    onChangeText={setMemoContent}
                    minHeight={120}
                    backgroundColor="white"
                    borderWidth={0}
                    fontSize="$5"
                    color="black"
                    placeholderTextColor="#999"
                    multiline
                    padding="$0"
                  />
                </YStack>

                {/* Category Selection */}
                <YStack gap="$3">
                  <Typography fontSize="$4" fontWeight="500" color="black">
                    카테고리
                  </Typography>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <XStack gap="$3">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          size="$3"
                          backgroundColor={
                            selectedCategory === category
                              ? "$textPrimary"
                              : "$surface"
                          }
                          borderWidth={1}
                          borderColor={
                            selectedCategory === category
                              ? "$textPrimary"
                              : "$border"
                          }
                          color={
                            selectedCategory === category
                              ? "$textOnPrimary"
                              : "$textPrimary"
                          }
                          borderRadius="$4"
                          pressStyle={{
                            backgroundColor:
                              selectedCategory === category
                                ? "$textPrimary"
                                : "$surfaceHover",
                          }}
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
                        backgroundColor="white"
                        borderWidth={1}
                        borderColor="$border"
                        borderStyle="dashed"
                        color="$textSecondary"
                        borderRadius="$4"
                        pressStyle={{ backgroundColor: "$surfaceHover" }}
                        onPress={() => {
                          setSelectedCategory("");
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
                      backgroundColor="white"
                      borderWidth={1}
                      borderColor="$border"
                      borderRadius="$4"
                      fontSize="$4"
                      color="black"
                      placeholderTextColor="#999"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                    />
                  )}
                </YStack>

                {/* Rating */}
                <YStack gap="$3">
                  <Typography fontSize="$4" fontWeight="500" color="black">
                    평점
                  </Typography>
                  <XStack alignItems="center" gap="$3">
                    {renderStars()}
                    <Typography fontSize="$3" color="#666">
                      {rating > 0 ? `${rating}/5` : "평점을 선택하세요"}
                    </Typography>
                  </XStack>
                </YStack>

                {/* Description */}
                <YStack gap="$3">
                  <Typography fontSize="$4" fontWeight="500" color="black">
                    추가 설명
                  </Typography>
                  <TextArea
                    placeholder="자세한 설명을 추가해보세요 (선택사항)"
                    value={description}
                    onChangeText={setDescription}
                    minHeight={80}
                    backgroundColor="white"
                    borderWidth={1}
                    borderColor="$border"
                    borderRadius="$4"
                    fontSize="$4"
                    color="black"
                    placeholderTextColor="#999"
                    multiline
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                  />
                </YStack>
              </YStack>
            </ScrollView>
          </YStack>

          {/* Fixed Bottom Button */}
          <YStack
            backgroundColor="white"
            paddingHorizontal="$5"
            paddingVertical="$4"
            borderTopWidth={1}
            borderTopColor="$border"
          >
            <Button
              backgroundColor={
                !memoContent.trim() ? "$surface" : "$textPrimary"
              }
              color={!memoContent.trim() ? "$textSecondary" : "$textOnPrimary"}
              borderRadius="$4"
              height="$5"
              fontSize="$5"
              fontWeight="600"
              pressStyle={{
                backgroundColor: !memoContent.trim()
                  ? "$surfaceHover"
                  : "$textPrimary",
              }}
              onPress={handleSaveMemo}
              disabled={!memoContent.trim()}
            >
              등록
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
