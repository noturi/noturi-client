import { KyInstance } from 'ky';
import { CreateTodoDto, Todo } from '~/entities/todo/model/types';
import { api } from '~/shared/api';

/**
 * Feature Layer - CUD 전용 API
 *
 * 이 클래스는 투두 피처의 변경 작업만 담당합니다.
 * - ✅ POST, PUT, DELETE, PATCH 요청만 처리
 * - ❌ GET 요청은 entities/todo/api/apis.ts에서 처리
 */
export class TodoMutationApi {
  private api: KyInstance;

  constructor(apiInstance: KyInstance) {
    this.api = apiInstance;
  }

  // 투두 생성
  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const response = await this.api.post('todos', {
      json: data,
    });
    return response.json<Todo>();
  }

  // 투두 완료 토글
  async toggleTodo(id: string): Promise<Todo> {
    const response = await this.api.patch(`todos/${id}/toggle`);
    return response.json<Todo>();
  }
}

export const todoMutationApi = new TodoMutationApi(api);
