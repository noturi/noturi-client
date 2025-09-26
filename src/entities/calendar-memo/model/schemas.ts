import { z } from 'zod';

// 알림 시간 옵션 스키마
export const NotifyBeforeSchema = z.enum([
  'FIVE_MINUTES_BEFORE',
  'FIFTEEN_MINUTES_BEFORE',
  'THIRTY_MINUTES_BEFORE',
  'ONE_HOUR_BEFORE',
  'ONE_DAY_BEFORE',
]);

// 캘린더 메모 기본 스키마
export const CalendarMemoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, '제목은 필수입니다'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  hasNotification: z.boolean(),
  notifyBefore: NotifyBeforeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// 캘린더 메모 목록 요청 파라미터 스키마
export const CalendarMemoListParamsDtoSchema = z.object({
  keyword: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  hasNotification: z.boolean().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// 캘린더 메모 목록 응답 스키마
export const CalendarMemoListResponseDtoSchema = z.object({
  data: z.array(CalendarMemoSchema),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

// 캘린더 메모 생성 요청 스키마
export const CreateCalendarMemoDtoSchema = z
  .object({
    title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 200자 이하여야 합니다'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    hasNotification: z.boolean().optional(),
    notifyBefore: NotifyBeforeSchema.optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: '시작 시간은 종료 시간보다 이전이어야 합니다',
    path: ['startDate'],
  });

// 캘린더 메모 수정 요청 스키마
export const UpdateCalendarMemoDtoSchema = z
  .object({
    id: z.string().uuid(),
    title: z
      .string()
      .min(1, '제목은 필수입니다')
      .max(200, '제목은 200자 이하여야 합니다')
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    hasNotification: z.boolean().optional(),
    notifyBefore: NotifyBeforeSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
      }
      return true;
    },
    {
      message: '시작 시간은 종료 시간보다 이전이어야 합니다',
      path: ['startDate'],
    },
  );
