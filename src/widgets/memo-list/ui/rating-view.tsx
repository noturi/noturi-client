import { ScrollView, YStack } from 'tamagui';
import type { UICategory } from '~/entities/category';
import type { UIMemo } from '~/entities/memo';
import { CategoryFilterBar, MemoRatingGroupView } from '~/widgets/memo-list/ui';

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
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 200 }}
      flex={1}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap="$6">
        <CategoryFilterBar categories={categories} onPress={onCategoryPress} />
        <MemoRatingGroupView
          isError={isError}
          isPending={isPending}
          memos={memos}
          onMemoPress={onMemoPress}
        />
      </YStack>
    </ScrollView>
  );
}
