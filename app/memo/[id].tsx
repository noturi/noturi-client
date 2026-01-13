import { memoDetailQuery } from '~/entities/memo';
import { MemoDeleteButton } from '~/features/memo/ui';
import { HREFS } from '~/shared/config';
import { FloatingButton, Loading, StarRating, Typography } from '~/shared/ui';

import { ScrollView, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { useQuery } from '@tanstack/react-query';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;

  const { data: memo, isLoading, error } = useQuery(memoDetailQuery(memoId));

  const handleEdit = () => {
    router.push(HREFS.memoEdit(memoId));
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-bg-primary">
        <Loading text="메모를 불러오는 중..." />
      </View>
    );
  }

  if (error || !memo) {
    return (
      <View className="flex-1 items-center justify-center bg-bg-primary">
        <Typography className="text-text-primary" variant="body">
          메모를 찾을 수 없습니다
        </Typography>
        <Typography className="text-text-muted mt-1" variant="footnote">
          {error?.message || '요청한 메모가 존재하지 않습니다'}
        </Typography>
      </View>
    );
  }

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
    <>
      <View className="flex-1 bg-bg-secondary p-4">
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View className="gap-1 p-1">
            <View className="gap-2">
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-center flex-1 gap-4">
                  {memo.category && (
                    <View
                      className="rounded-2 px-3 py-2"
                      style={{ backgroundColor: memo.category.color }}
                    >
                      <Typography className="text-white text-2 font-medium" variant="caption2">
                        {memo.category.name}
                      </Typography>
                    </View>
                  )}
                  <Typography className="text-text-muted" variant="caption2">
                    {formatDate(memo.createdAt)}
                  </Typography>
                </View>
                <View className="flex-row items-center gap-2">
                  {memo.rating > 0 && <StarRating rating={memo.rating} />}
                  <MemoDeleteButton memoId={memoId} memoTitle={memo.title} />
                </View>
              </View>

              <Typography className="text-text-primary" variant="headline">
                {memo.title}
              </Typography>
            </View>

            <View className="gap-2 mt-2">
              <Typography className="text-text-primary" variant="callout">
                {memo.content}
              </Typography>
            </View>
          </View>
        </ScrollView>
      </View>

      <View className="absolute bottom-[120px] right-4">
        <FloatingButton onPress={handleEdit} />
      </View>
    </>
  );
}
