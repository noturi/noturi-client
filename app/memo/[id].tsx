import { ScrollView, XStack, YStack } from 'tamagui';

import { useLocalSearchParams } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

import { StarRating } from '@/components/memo/StarRating';
import { Loading, Typography } from '@/components/ui';
import { memoDetailQuery } from '@/services/memo/queries';

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
        <Typography color="$textPrimary" variant="title">
          메모를 찾을 수 없습니다
        </Typography>
        <Typography color="$textMuted" marginTop="$2" variant="body">
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
          {/* 헤더 정보 */}
          <YStack gap="$3">
            <XStack alignItems="flex-start" justifyContent="space-between">
              <XStack alignItems="center" flex={1} gap="$2">
                <YStack
                  backgroundColor={memo.category.color}
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                >
                  <Typography color="white" fontSize="$2" fontWeight="$4" variant="caption">
                    {memo.category.name}
                  </Typography>
                </YStack>
                <Typography color="$textMuted" variant="caption">
                  {formatDate(memo.createdAt)}
                </Typography>
              </XStack>
              <StarRating rating={memo.rating} />
            </XStack>

            <Typography color="$textPrimary" lineHeight="$2" variant="heading">
              {memo.title}
            </Typography>
          </YStack>

          {/* 메모 내용 */}
          <YStack gap="$3" marginTop="$2">
            <Typography color="$textPrimary" fontSize="$4" lineHeight="$4" variant="body">
              {memo.content}
            </Typography>
          </YStack>

          {/* 메타 정보 */}
          <YStack
            borderTopColor="$border"
            borderTopWidth={1}
            gap="$3"
            marginTop="$4"
            paddingTop="$4"
          >
            <XStack justifyContent="space-between">
              <YStack gap="$1">
                <Typography color="$textMuted" variant="caption">
                  작성일
                </Typography>
                <Typography color="$textSecondary" variant="small">
                  {formatDate(memo.createdAt)}
                </Typography>
              </YStack>

              {memo.experienceDate && (
                <YStack alignItems="flex-end" gap="$1">
                  <Typography color="$textMuted" variant="caption">
                    경험일
                  </Typography>
                  <Typography color="$textSecondary" variant="small">
                    {new Date(memo.experienceDate).toLocaleDateString('ko-KR')}
                  </Typography>
                </YStack>
              )}
            </XStack>

            {memo.updatedAt !== memo.createdAt && (
              <YStack gap="$1">
                <Typography color="$textMuted" variant="caption">
                  수정일
                </Typography>
                <Typography color="$textSecondary" variant="small">
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
