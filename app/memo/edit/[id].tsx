import { MemoEditForm } from '~/features/memo/ui';

import { router, useLocalSearchParams } from 'expo-router';

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;

  return <MemoEditForm memoId={memoId} onSuccess={() => router.back()} />;
}
