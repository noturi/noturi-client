import { useToast } from '~/shared/lib/use-toast';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { onlineManager } from '@tanstack/react-query';

/** 연결 상태가 바뀔 때만 토스트 — 저장된 데이터를 보고 있다는 걸 알려줌 (화면 요소 없음) */
export function OnlineStatusNotice() {
  const isOnline = useSyncExternalStore(onlineManager.subscribe, () => onlineManager.isOnline());
  const toast = useToast();
  // 마지막으로 안내한 상태 — 같은 상태로 effect가 다시 실행돼도 토스트를 반복하지 않음
  const notifiedOnlineRef = useRef(true);

  useEffect(() => {
    if (notifiedOnlineRef.current === isOnline) return;
    notifiedOnlineRef.current = isOnline;

    if (isOnline) {
      toast.showSuccess('다시 연결되었어요.');
    } else {
      toast.showError('오프라인 상태예요. 저장된 내용을 보여드려요.');
    }
  }, [isOnline, toast]);

  return null;
}
