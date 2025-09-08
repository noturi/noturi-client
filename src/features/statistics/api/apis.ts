import { KyInstance } from 'ky';
import {
  CategoryStatsResponseDto,
  OverallStats,
  OverallStatsParamsDto,
  TrendsParamsDto,
  TrendsResponseDto,
} from '~/entities/statistics';
import { api } from '~/shared/api';

export class StatisticsApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 트렌드 분석 조회
  async getTrends(params: TrendsParamsDto = {}): Promise<TrendsResponseDto> {
    const searchParams = new URLSearchParams();

    if (params.year) searchParams.append('year', params.year.toString());
    if (params.month) searchParams.append('month', params.month.toString());

    const response = await this.api
      .get('statistics/trends', {
        searchParams,
      })
      .json<TrendsResponseDto>();

    return response;
  }

  // 전체 통계 조회
  async getOverallStats(params: OverallStatsParamsDto = {}): Promise<OverallStats> {
    const searchParams = new URLSearchParams();

    if (params.year) searchParams.append('year', params.year.toString());
    if (params.month) searchParams.append('month', params.month.toString());

    const response = await this.api
      .get('statistics/overview', {
        searchParams,
      })
      .json<OverallStats>();

    return response;
  }

  // 카테고리별 통계 조회
  async getCategoryStats(): Promise<CategoryStatsResponseDto[]> {
    const response = await this.api.get('statistics/categories').json<CategoryStatsResponseDto[]>();
    return response;
  }
}

export const statisticsApi = new StatisticsApi(api);
