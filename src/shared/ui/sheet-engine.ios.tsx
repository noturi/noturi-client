// iOS: Expo UI의 @gorhom 호환 drop-in — SwiftUI 네이티브 시트(iOS 26 Liquid Glass, 시스템 딤·핸들)
export {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from '@expo/ui/community/bottom-sheet';

/** true면 시스템 시트 모양(iOS 26 Liquid Glass)을 쓰므로 배경·핸들·딤 처리를 직접 하지 않음 */
export const USES_NATIVE_SHEET = true;

/** 시스템 시트가 딤 처리를 하므로 별도 backdrop 없음 */
export const SheetBackdrop = undefined;
