import { MemoDetailPage } from '~/pages/memo-detail';

import { useLocalSearchParams } from 'expo-router';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams();

  return <MemoDetailPage memoId={id as string} />;
}
