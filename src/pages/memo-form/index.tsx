import { CategoryInlineAddForm } from '~/features/categories';
import { MemoForm } from '~/features/memo';

import { View } from 'react-native';

interface MemoFormPageProps {
  /** 있으면 수정 모드, 없으면 생성 모드 */
  memoId?: string;
  onSuccess: () => void;
}

export function MemoFormPage({ memoId, onSuccess }: MemoFormPageProps) {
  return (
    <View className="flex-1 bg-bg-secondary">
      <MemoForm
        memoId={memoId}
        renderAddCategory={(slotProps) => <CategoryInlineAddForm {...slotProps} />}
        shouldAutoFocus={!memoId}
        onSuccess={onSuccess}
      />
    </View>
  );
}
