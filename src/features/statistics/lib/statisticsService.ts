import { CategoryStats, CategoryStatsResponse } from '~/entities/statistics';

export class StatisticsService {
  // 서버 응답을 UI용 데이터로 변환
  static transformCategoryStats(response: CategoryStatsResponse[]): CategoryStats[] {
    return response.map((item) => ({
      ...item,
      color: this.getCategoryColor(item.name),
      description: this.getCategoryDescription(item.name),
    }));
  }

  // 카테고리별 색상 매핑
  private static getCategoryColor(categoryName: string): string {
    const colorMap: Record<string, string> = {
      영화: '#667eea',
      책: '#764ba2',
      음악: '#f093fb',
      드라마: '#4facfe',
      게임: '#43e97b',
      // 기본 색상들
      default: '#8e8e93',
    };
    return colorMap[categoryName] || colorMap.default;
  }

  // 카테고리별 설명 매핑
  private static getCategoryDescription(categoryName: string): string {
    // 실제 카테고리 이름을 그대로 사용
    return categoryName;
  }
}
