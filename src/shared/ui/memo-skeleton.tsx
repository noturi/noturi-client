import { View } from 'react-native';

import { Card } from './card';
import { Skeleton } from './skeleton';

export function MemoSkeleton() {
  return (
    <View className="gap-3">
      {/* Header: "메모" + 년도 선택기 */}
      <View className="flex-row items-center justify-between px-3">
        <Skeleton borderRadius={4} height={22} width={40} />
        <View className="flex-row items-center gap-2">
          <Skeleton borderRadius={4} height={18} width={32} />
          <Skeleton borderRadius={4} height={12} width={12} />
        </View>
      </View>

      {/* Rating Group Cards */}
      <View className="mb-5 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            {/* Rating header: 별점 + (N개) + 화살표 */}
            <View className="flex-row items-center gap-2 p-3">
              <View className="flex-1 flex-row items-center gap-2">
                <View className="flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} borderRadius={2} height={14} width={14} />
                  ))}
                </View>
                <Skeleton borderRadius={4} height={14} width={28} />
              </View>
              <Skeleton borderRadius={2} height={16} width={16} />
            </View>

            {/* Divider */}
            <View className="h-px bg-border" />

            {/* Memo titles */}
            <View className="gap-1 p-3">
              <Skeleton borderRadius={4} height={20} width="70%" />
              <Skeleton borderRadius={4} height={20} width="55%" />
              <Skeleton borderRadius={4} height={20} width="45%" />
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
