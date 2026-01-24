import { KyInstance } from 'ky';
import {
  TodoListParamsDto,
  TodoListResponseDto,
  TodoMonthlyStatsDto,
  TodoMonthlyStatsParamsDto,
  TodoOverviewStatsDto,
  TodoTemplateListResponseDto,
  TodoWeeklyStatsDto,
} from '~/entities/todo/model/types';
import { api, toSearchParams } from '~/shared/api';

/**
 * Entity Layer - READ 전용 API
 *
 * 이 클래스는 투두 엔티티의 조회 작업만 담당합니다.
 * - ✅ GET 요청만 처리
 * - ❌ POST, PUT, DELETE는 features/todo/api/apis.ts에서 처리
 */
export class TodoApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 투두 목록 조회
  async getTodos(params: TodoListParamsDto = {}): Promise<TodoListResponseDto> {
    const response = await this.api.get('todos', {
      searchParams: toSearchParams(params),
    });
    return response.json<TodoListResponseDto>();
  }

  // 월간 통계 조회
  async getMonthlyStats(params: TodoMonthlyStatsParamsDto): Promise<TodoMonthlyStatsDto> {
    const response = await this.api.get('todos/stats/monthly', {
      searchParams: toSearchParams(params),
    });
    return response.json<TodoMonthlyStatsDto>();
  }

  // 주간 통계 조회
  async getWeeklyStats(): Promise<TodoWeeklyStatsDto> {
    const response = await this.api.get('todos/stats/weekly');
    return response.json<TodoWeeklyStatsDto>();
  }

  // 전체 통계 개요 조회
  async getOverviewStats(): Promise<TodoOverviewStatsDto> {
    const response = await this.api.get('todos/stats/overview');
    return response.json<TodoOverviewStatsDto>();
  }

  // 반복 템플릿 목록 조회
  async getTemplates(): Promise<TodoTemplateListResponseDto> {
    const response = await this.api.get('todos/templates');
    return response.json<TodoTemplateListResponseDto>();
  }
}

export const todoApi = new TodoApi(api);
