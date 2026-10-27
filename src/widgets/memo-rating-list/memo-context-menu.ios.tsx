import { MenuView } from '@expo/ui/community/menu';

import type { MemoContextMenuProps } from './memo-context-menu';

const ACTIONS = [
  { id: 'edit', title: '수정', image: 'pencil' },
  { id: 'delete', title: '삭제', image: 'trash', attributes: { destructive: true } },
] as const;

/** iOS: 메모를 길게 누르면 네이티브 컨텍스트 메뉴 (iOS 26 Liquid Glass) */
export function MemoContextMenu({ onEdit, onDelete, children }: MemoContextMenuProps) {
  return (
    <MenuView
      shouldOpenOnLongPress
      actions={[...ACTIONS]}
      onPressAction={({ nativeEvent }) => {
        if (nativeEvent.event === 'edit') onEdit();
        if (nativeEvent.event === 'delete') onDelete();
      }}
    >
      {children}
    </MenuView>
  );
}
