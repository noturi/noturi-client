import type { z } from 'zod';
import Logger from '~/shared/lib/logger';

/**
 * API 응답을 zod 스키마로 검증한다.
 * 스키마 불일치는 서버 계약 위반이므로 로그로 드러내되, 앱이 즉시 죽지 않도록 원본을 그대로 반환한다.
 */
export function parseResponse<T extends z.ZodType>(
  schema: T,
  data: unknown,
  label: string,
): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    Logger.error(`[API 응답 스키마 불일치] ${label}`, result.error.issues);
    return data as z.output<T>;
  }
  return result.data;
}
