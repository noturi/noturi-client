import { Typography } from "@/components/ui";
import { StarRating } from "@/components/memo/StarRating";
import { memoDetailQuery } from "@/services/memo/queries";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Spinner, XStack, YStack } from "tamagui";

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;
  
  const { data: memo, isLoading, error } = useQuery(memoDetailQuery(memoId));

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$backgroundPrimary">
        <Spinner size="large" color="$accent" />
        <Typography variant="body" color="$textMuted" marginTop="$3">
          메모를 불러오는 중...
        </Typography>
      </YStack>
    );
  }

  if (error || !memo) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$backgroundPrimary">
        <Typography variant="title" color="$textPrimary">
          메모를 찾을 수 없습니다
        </Typography>
        <Typography variant="body" color="$textMuted" marginTop="$2">
          {error?.message || "요청한 메모가 존재하지 않습니다"}
        </Typography>
      </YStack>
    );
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <YStack flex={1} backgroundColor="$backgroundPrimary">
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          {/* 헤더 정보 */}
          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <XStack alignItems="center" gap="$2" flex={1}>
                <YStack
                  backgroundColor={memo.category.color}
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$3"
                >
                  <Typography
                    variant="caption"
                    color="white"
                    fontWeight="$4"
                    fontSize="$2"
                  >
                    {memo.category.name}
                  </Typography>
                </YStack>
                <Typography variant="caption" color="$textMuted">
                  {formatDate(memo.createdAt)}
                </Typography>
              </XStack>
              <StarRating rating={memo.rating} />
            </XStack>
            
            <Typography
              variant="heading"
              color="$textPrimary"
              lineHeight="$2"
            >
              {memo.title}
            </Typography>
          </YStack>

          {/* 메모 내용 */}
          <YStack gap="$3" marginTop="$2">
            <Typography
              variant="body"
              color="$textPrimary"
              lineHeight="$4"
              fontSize="$4"
            >
              {memo.content}
            </Typography>
          </YStack>

          {/* 메타 정보 */}
          <YStack gap="$3" paddingTop="$4" borderTopWidth={1} borderTopColor="$border" marginTop="$4">
            <XStack justifyContent="space-between">
              <YStack gap="$1">
                <Typography variant="caption" color="$textMuted">
                  작성일
                </Typography>
                <Typography variant="small" color="$textSecondary">
                  {formatDate(memo.createdAt)}
                </Typography>
              </YStack>
              
              {memo.experienceDate && (
                <YStack gap="$1" alignItems="flex-end">
                  <Typography variant="caption" color="$textMuted">
                    경험일
                  </Typography>
                  <Typography variant="small" color="$textSecondary">
                    {new Date(memo.experienceDate).toLocaleDateString('ko-KR')}
                  </Typography>
                </YStack>
              )}
            </XStack>
            
            {memo.updatedAt !== memo.createdAt && (
              <YStack gap="$1">
                <Typography variant="caption" color="$textMuted">
                  수정일
                </Typography>
                <Typography variant="small" color="$textSecondary">
                  {formatDate(memo.updatedAt)}
                </Typography>
              </YStack>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}