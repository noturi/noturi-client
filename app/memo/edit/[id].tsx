import { MemoForm } from '~/features/memo/ui';

import { router, useLocalSearchParams } from 'expo-router';

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams();
  const memoId = id as string;

  return <MemoForm memoId={memoId} onSuccess={() => router.back()} />;
}
