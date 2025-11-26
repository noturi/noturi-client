import { ReactNode, createContext, useMemo, useState } from 'react';

export interface CalendarDateState {
  startDate: string;
  endDate: string;
  currentMonth: string;
}

export interface CalendarDateActions {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setCurrentMonth: (month: string) => void;
  setDateRange: (start: string, end: string) => void;
  clearSelection: () => void;
}

export type CalendarDateContextValue = CalendarDateState & CalendarDateActions;

export const CalendarDateContext = createContext<CalendarDateContextValue | null>(null);

interface CalendarDateProviderProps {
  children: ReactNode;
}

export function CalendarDateProvider({ children }: CalendarDateProviderProps) {
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  const contextValue = useMemo<CalendarDateContextValue>(
    () => ({
      // State
      startDate,
      endDate,
      currentMonth,

      // Actions
      setStartDate,
      setEndDate,
      setCurrentMonth,
      setDateRange: (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
      },
      clearSelection: () => {
        setStartDate('');
        setEndDate('');
      },
    }),
    [startDate, endDate, currentMonth],
  );

  return (
    <CalendarDateContext.Provider value={contextValue}>{children}</CalendarDateContext.Provider>
  );
}
