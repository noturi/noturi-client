import { ScrollView, XStack, YStack } from 'tamagui';
import { memoDetailQuery } from '~/features/memo/api/queries';
import { MemoDeleteButton } from '~/features/memo/ui';
import { Loading, StarRating, Typography } from '~/shared/ui';

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
        <Typography color="$textPrimary" variant="body">
          메모를 찾을 수 없습니다
        </Typography>
        <Typography color="$textMuted" marginTop="$1" variant="footnote">
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
    <YStack backgroundColor="$backgroundSecondary" flex={1} padding="$4">
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$1" padding="$1">
          <YStack gap="$2">
            <XStack alignItems="flex-start" justifyContent="space-between">
              <XStack alignItems="center" flex={1} gap="$4">
                <YStack
                  backgroundColor={memo.category.color}
                  borderRadius="$2"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  <Typography color="white" fontSize="$2" fontWeight="$4" variant="caption2">
                    {memo.category.name}
                  </Typography>
                </YStack>
                <Typography color="$textMuted" variant="caption2">
                  {formatDate(memo.createdAt)}
                </Typography>
              </XStack>
              <XStack alignItems="center" gap="$2">
                <StarRating rating={memo.rating} />
                <MemoDeleteButton memoId={memoId} memoTitle={memo.title} />
              </XStack>
            </XStack>

            <Typography color="$textPrimary" variant="headline">
              {memo.title}
            </Typography>
          </YStack>

          <YStack gap="$2" marginTop="$2">
            <Typography color="$textPrimary" variant="callout">
              {memo.content}
            </Typography>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
