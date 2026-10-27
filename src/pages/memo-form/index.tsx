import { useCreateCategoryMutation } from '~/features/categories';
import { MemoForm } from '~/features/memo';

import { View } from 'react-native';

interface MemoFormPageProps {
  /** 있으면 수정 모드, 없으면 생성 모드 */
  memoId?: string;
  onSuccess: () => void;
}

export function MemoFormPage({ memoId, onSuccess }: MemoFormPageProps) {
  // 에러는 MemoForm이 카테고리 입력 필드에 표시하므로 전역 Alert를 대체
  const createCategoryMutation = useCreateCategoryMutation({ onError: () => {} });

  return (
    <View className="flex-1 bg-bg-secondary">
      <MemoForm
        isCreatingCategory={createCategoryMutation.isPending}
        memoId={memoId}
        shouldAutoFocus={!memoId}
        onCreateCategory={createCategoryMutation.mutateAsync}
        onSuccess={onSuccess}
      />
    </View>
  );
}
