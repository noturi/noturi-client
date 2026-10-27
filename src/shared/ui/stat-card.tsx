import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from './card';
import { Typography } from './typography';

interface StatCardProps {
  label: string;
  /** 값 — 글자 한 줄 높이를 넘지 않게 (아이콘은 12px 이하) */
  children: ReactNode;
}

/** 통계 요약 카드 (라벨 + 값) — 탭 간 높이·여백 통일 */
export function StatCard({ label, children }: StatCardProps) {
  return (
    <Card>
      <View className="flex-1 flex-row items-center gap-2 px-2">
        <Typography variant="footnote">{label}</Typography>
        {children}
      </View>
    </Card>
  );
}
