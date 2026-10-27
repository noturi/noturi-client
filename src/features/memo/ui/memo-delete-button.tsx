import { Trash2 } from '~/shared/lib/icons';
import { Button } from '~/shared/ui';

import { useConfirmDeleteMemo } from '../model';

interface MemoDeleteButtonProps {
  memoId: string;
  memoTitle: string;
  /** 삭제 성공 후 처리 (예: 화면 이동) — 호출자가 결정 */
  onDeleted?: () => void;
}

export const MemoDeleteButton = ({ memoId, memoTitle, onDeleted }: MemoDeleteButtonProps) => {
  const { confirmDelete, isDeleting } = useConfirmDeleteMemo();
  const handleDelete = () => confirmDelete({ id: memoId, title: memoTitle }, onDeleted);

  return (
    <Button isIconOnly isDisabled={isDeleting} size="sm" variant="ghost" onPress={handleDelete}>
      <Trash2 className="text-text-primary" size={16} />
    </Button>
  );
};
