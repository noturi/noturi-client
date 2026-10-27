// 바텀시트 구현 선택 (Android/웹) — iOS는 sheet-engine.ios.ts(SwiftUI 네이티브 시트)
import { BottomSheetBackdrop, type BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

export {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

/** true면 시스템 시트 모양(iOS 26 Liquid Glass)을 쓰므로 배경·핸들·딤 처리를 직접 하지 않음 */
export const USES_NATIVE_SHEET = false;

export function SheetBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      pressBehavior="close"
    />
  );
}
