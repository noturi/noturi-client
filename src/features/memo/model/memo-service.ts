import { Memo, memoApi, UIMemo } from '~/entities/memo';
import { formatTimeAgo } from '~/shared/lib/format-time';

/**
 * 메모 서비스 클래스
 * 메모 관련 비즈니스 로직과 데이터 변환을 담당
 */
export class MemoService {
  /**
   * 메모 검색 결과 하이라이팅
   */
  async searchMemosWithHighlight(query: string) {
    const result = await memoApi.searchMemos(query);

    // 검색 결과에 하이라이팅 로직 추가
    const highlightedMemos = result.memos.map((memo: Memo) => ({
      ...memo,
      highlightedTitle: this.highlightText(memo.title, query),
      highlightedContent: this.highlightText(memo.content, query),
    }));

    return {
      ...result,
      memos: highlightedMemos,
    };
  }

  /**
   * 메모 통계 데이터 가공
   */
  async getMemoInsights() {
    const stats = await memoApi.getMemoStats();
    const categories = await memoApi.getCategories();

    // 통계 데이터 가공
    const insights = {
      ...stats,
      categoryStats: categories,
      averageMemosPerCategory: categories.length > 0 ? stats.totalMemos / categories.length : 0,
      topCategory: categories.reduce(
        (prev: any, current: any) => (prev.count > current.count ? prev : current),
        categories[0],
      ),
    };

    return insights;
  }

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

  /**
   * 텍스트 하이라이팅 헬퍼 함수
   */
  private highlightText(text: string, query: string): string {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * 메모 내보내기 (향후 구현)
   */
  async exportMemos(format: 'json' | 'csv' | 'txt' = 'json') {
    const allMemos = await memoApi.getMemos({ limit: 1000 }); // 모든 메모 가져오기

    switch (format) {
      case 'json':
        return JSON.stringify(allMemos.data, null, 2);
      case 'csv':
        // CSV 변환 로직 (향후 구현)
        throw new Error('CSV 내보내기는 아직 지원되지 않습니다.');
      case 'txt':
        // TXT 변환 로직 (향후 구현)
        throw new Error('TXT 내보내기는 아직 지원되지 않습니다.');
      default:
        throw new Error('지원되지 않는 형식입니다.');
    }
  }
}

export const memoService = new MemoService();
