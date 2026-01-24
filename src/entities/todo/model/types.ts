// 투두 아이템
export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: string;
  isCompleted: boolean;
  completedAt?: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

// 투두 목록 조회 파라미터
export interface TodoListParamsDto {
  date?: string; // 특정 날짜 조회 (있으면 year/month 무시)
  year?: number; // 년도 (월별 조회용)
  month?: number; // 월 (월별 조회용)
}

// 투두 목록 응답
export interface TodoListResponseDto {
  date?: string;
  year: number;
  month: number;
  data: Todo[];
}

// 일별 통계
export interface DailyStat {
  date: string;
  total: number;
  completed: number;
  rate: number;
}

// 월간 통계 파라미터
export interface TodoMonthlyStatsParamsDto {
  year: number;
  month: number;
}

// 월간 통계 응답
export interface TodoMonthlyStatsDto {
  year: number;
  month: number;
  dailyStats: DailyStat[];
}

// 요일별 통계
export interface DailyBreakdown {
  dayOfWeek: number; // 0 = 일요일, 1 = 월요일, ...
  total: number;
  completed: number;
  rate: number;
}

// 주간 통계 응답
export interface TodoWeeklyStatsDto {
  weekStart: string;
  weekEnd: string;
  total: number;
  completed: number;
  rate: number;
  dailyBreakdown: DailyBreakdown[];
}

// 전체 통계 개요 응답
export interface TodoOverviewStatsDto {
  totalTodos: number;
  completedTodos: number;
  overallRate: number;
  currentStreak: number;
  bestStreak: number;
}

// 반복 타입
export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

// 반복 템플릿
export interface TodoTemplate {
  id: string;
  title: string;
  description?: string;
  recurrenceType: RecurrenceType;
  recurrenceDays: number[]; // WEEKLY: 0-6 (요일), MONTHLY: 1-31 (일)
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 템플릿 목록 응답
export interface TodoTemplateListResponseDto {
  data: TodoTemplate[];
  total: number;
}

// 투두 생성 DTO
export type CreateRecurrenceType = 'NONE' | RecurrenceType;

export interface CreateTodoDto {
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  recurrenceType: CreateRecurrenceType;
  recurrenceDays?: number[]; // WEEKLY: 0-6, MONTHLY: 1-31
  endDate?: string; // 반복 종료일
}
