import { MemoFormPage } from '~/pages/memo-form';

import { router } from 'expo-router';

export default function RatingMemoCreateScreen() {
  return <MemoFormPage onSuccess={() => router.push('/(tabs)')} />;
}
