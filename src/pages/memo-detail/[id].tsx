import { ScrollView, XStack, YStack } from 'tamagui';
import { memoDetailQuery } from '~/features/memo-crud/api/queries';
import { StarRating } from '~/features/memo-crud/ui/StarRating';
import { Loading, Typography } from '~/shared/ui';

import { useLocalSearchParams } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;

  const { data: memo, isLoading, error } = useQuery(memoDetailQuery(memoId));

  if (isLoading) {
    return (
      <YStack backgroundColor="$backgroundPrimary" flex={1}>
        <Loading text="메모를 불러오는 중..." />
      </YStack>
    );
  }

  if (error || !memo) {
    return (
      <YStack
        alignItems="center"
        backgroundColor="$backgroundPrimary"
        flex={1}
        justifyContent="center"
      >
        <Typography color="$textPrimary" variant="body1">
          메모를 찾을 수 없습니다
        </Typography>
        <Typography color="$textMuted" marginTop="$2" variant="body3">
          {error?.message || '요청한 메모가 존재하지 않습니다'}
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
      minute: '2-digit',
    });
  };

  return (
    <YStack backgroundColor="$backgroundPrimary" flex={1}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$4" padding="$4">
          <YStack gap="$sm">
            <XStack alignItems="flex-start" justifyContent="space-between">
              <XStack alignItems="center" flex={1} gap="$2">
                <YStack
                  backgroundColor={memo.category.color}
                  borderRadius="$sm"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                >
                  <Typography color="white" fontSize="$sm" fontWeight="$medium" variant="caption2">
                    {memo.category.name}
                  </Typography>
                </YStack>
                <Typography color="$textMuted" variant="caption2">
                  {formatDate(memo.createdAt)}
                </Typography>
              </XStack>
              <StarRating rating={memo.rating} />
            </XStack>

            <Typography color="$textPrimary" variant="title">
              {memo.title}
            </Typography>
          </YStack>

          <YStack gap="$sm" marginTop="$2">
            <Typography color="$textPrimary" variant="body2">
              {memo.content}
            </Typography>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
