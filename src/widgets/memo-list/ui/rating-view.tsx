import { ScrollView, YStack } from 'tamagui';
import type { UICategory } from '~/entities/category';
import type { UIMemo } from '~/entities/memo';
import { FloatingButton } from '~/shared/ui';
import { CategoryFilterBar, MemoRatingGroupView } from '~/widgets/memo-list/ui';

import { useCallback } from 'react';

import { router } from 'expo-router';

interface RatingViewProps {
  categories: UICategory[];
  memos: UIMemo[];
  isError: boolean;
  isPending: boolean;
  onCategoryPress: (categoryName: string) => void;
  onMemoPress: (memo: UIMemo) => void;
}

export function RatingView({
  categories,
  memos,
  isError,
  isPending,
  onCategoryPress,
  onMemoPress,
}: RatingViewProps) {
  const handleFloatingButtonPress = useCallback(() => {
    router.push('/memo/create/rating');
  }, []);

  return (
    <YStack flex={1} position="relative">
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack gap="$4" paddingHorizontal="$4" paddingTop="$4">
          <CategoryFilterBar categories={categories} onPress={onCategoryPress} />
          <MemoRatingGroupView
            isError={isError}
            isPending={isPending}
            memos={memos}
            onMemoPress={onMemoPress}
          />
        </YStack>
      </ScrollView>
      <YStack bottom={140} position="absolute" right="$4">
        <FloatingButton onPress={handleFloatingButtonPress} />
      </YStack>
    </YStack>
  );
}
