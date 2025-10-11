import { use } from 'react';

import { CalendarDateContext, CalendarDateContextValue } from './calendar-date-context';

export function useCalendarDate(): CalendarDateContextValue {
  const context = use(CalendarDateContext);

  if (!context) {
    throw new Error('useCalendarDate는 CalendarDateProvider 내부에서 사용되어야 합니다');
  }

  return context;
}
