import type { ReactNode } from 'react';

export interface MemoContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  children: ReactNode;
}

/** Android/웹: 길게 누르기 메뉴 없음 (iOS는 memo-context-menu.ios.tsx의 네이티브 메뉴) */
export function MemoContextMenu({ children }: MemoContextMenuProps) {
  return <>{children}</>;
}
