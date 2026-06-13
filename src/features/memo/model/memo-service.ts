import { Memo, UIMemo } from '~/entities/memo';
import { formatTimeAgo } from '~/shared/lib/format';

/**
 * 메모 서비스 클래스
 * 메모 관련 데이터 변환을 담당
 */
export class MemoService {
  /**
   * 백엔드 메모 데이터를 UI용 메모 데이터로 변환
   */
  static transformToUIMemos(backendMemos: Memo[] | undefined): UIMemo[] {
    if (!backendMemos) return [];

    return backendMemos.map((memo: Memo) => ({
      id: memo.id,
      title: memo.title,
      category: memo.category || {
        id: 'default',
        name: '기타',
        color: '#6b7280',
      },
      content: memo.content,
      rating: memo.rating,
      timeAgo: formatTimeAgo(memo.createdAt),
    }));
  }
}
