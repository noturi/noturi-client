import { MemoFormPage } from '~/pages/memo-form';

import { router, useLocalSearchParams } from 'expo-router';

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams();

  return <MemoFormPage memoId={id as string} onSuccess={() => router.back()} />;
}
