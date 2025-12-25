import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { UIMemo } from '~/entities/memo/model/types';
import { HREFS } from '~/shared/config';
import { StarRating, Typography } from '~/shared/ui';

interface MemoItemProps {
  memo: UIMemo;
}

export const MemoItem = ({ memo }: MemoItemProps) => (
  <Pressable
    className="bg-bg-primary px-1 py-2 active:opacity-80"
    onPress={() => {
      router.push(HREFS.memoDetail(memo.id));
    }}
  >
    <View className="flex-row items-start justify-between mb-1">
      <View className="flex-1">
        <View className="flex-row items-center gap-1 mb-1">
          <View
            className="rounded-2 px-2 py-2"
            style={{ backgroundColor: memo.category.color }}
          >
            <Typography className="font-medium" variant="caption1">
              {memo.category.name}
            </Typography>
          </View>
          <Typography className="text-text-muted" variant="caption1">
            {memo.timeAgo}
          </Typography>
        </View>
        <Typography
          className="text-text-primary font-medium mb-1"
          numberOfLines={1}
          variant="callout"
        >
          {memo.title}
        </Typography>
      </View>
      <View className="flex-row items-center gap-1">
        <StarRating rating={memo.rating} />
      </View>
    </View>

    <Typography className="text-text-secondary" numberOfLines={2} variant="caption1">
      {memo.content}
    </Typography>
  </Pressable>
);
