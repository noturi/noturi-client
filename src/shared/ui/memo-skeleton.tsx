import { View } from 'react-native';

import { Card } from './card';
import { Skeleton } from './skeleton';

export function MemoSkeleton() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-3">
        <Skeleton borderRadius={4} height={24} width={50} />
        <View className="flex-row items-center gap-2">
          <Skeleton borderRadius={4} height={16} width={16} />
          <Skeleton borderRadius={4} height={16} width={40} />
          <Skeleton borderRadius={4} height={16} width={12} />
        </View>
      </View>
      <View className="gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <View className="gap-3 p-3">
              <Skeleton borderRadius={4} height={20} width={80} />
              <View className="gap-2">
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width="75%" />
                <Skeleton height={16} width="60%" />
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}
