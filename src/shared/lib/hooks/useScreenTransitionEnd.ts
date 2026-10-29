import { useEffect, useState } from 'react';

import { type NativeStackNavigationProp, useNavigation } from 'expo-router';

/** transitionEnd가 오지 않는 경우(애니메이션 없는 진입 등)를 위한 안전망 — 기본 push 전환(약 350ms)보다 길게 */
const FALLBACK_MS = 600;

/**
 * 화면 진입(push) 전환이 끝났는지.
 * iOS는 전환 중에 입력칸을 포커스하면 키보드가 화면과 함께 옆에서 밀려 들어오므로,
 * 자동 포커스는 이 값이 true가 된 뒤에 한다.
 */
export function useScreenTransitionEnd(): boolean {
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', (e) => {
      if (!e.data.closing) setIsDone(true);
    });
    const timer = setTimeout(() => setIsDone(true), FALLBACK_MS);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigation]);

  return isDone;
}
