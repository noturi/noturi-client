import { useEffect, useState } from 'react';

/**
 * 디바운싱 훅
 * @param value - 디바운싱할 값
 * @param delay - 디바운싱 지연 시간(ms)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
