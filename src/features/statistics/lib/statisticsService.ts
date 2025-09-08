import { CategoryStatsResponseDto } from '~/entities/statistics';

export class StatisticsService {
  // 카테고리별 색상 매핑
  static getCategoryColor(categoryName: string): string {
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

  // 카테고리별 설명 생성
  static getCategoryDescription(stats: CategoryStatsResponseDto): string {
    return `총 ${stats.count}개 메모, 평균 ${stats.averageRating.toFixed(1)}점`;
  }
}
