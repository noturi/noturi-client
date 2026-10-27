import { FALLBACK_CATEGORY_COLOR, UNCATEGORIZED_LABEL } from '~/shared/config';
import { formatTimeAgo } from '~/shared/lib/format';

import type { Memo, UIMemo } from '../model/types';

/**
 * 백엔드 메모 데이터를 UI용 메모 데이터로 변환
 */
export function toUIMemos(backendMemos: Memo[] | undefined): UIMemo[] {
  if (!backendMemos) return [];

  return backendMemos.map((memo) => ({
    id: memo.id,
    title: memo.title,
    category: memo.category || {
      id: 'default',
      name: UNCATEGORIZED_LABEL,
      color: FALLBACK_CATEGORY_COLOR,
    },
    content: memo.content,
    rating: memo.rating,
    timeAgo: formatTimeAgo(memo.createdAt),
  }));
}
