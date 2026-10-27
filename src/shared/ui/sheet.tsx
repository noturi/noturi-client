import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/shared/lib/theme-context';

import { type ReactNode, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

// 모든 바텀시트 공통 backdrop — backdropComponent에 그대로 전달
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

// Controlled Sheet that uses BottomSheetModal (renders above tabs via Portal)
interface ControlledSheetProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
}

const DEFAULT_SNAP_POINTS = ['50%', '90%'];

export function ControlledSheet({
  children,
  isOpen,
  onClose,
  snapPoints: customSnapPoints,
  scrollable = false,
}: ControlledSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { hexColors } = useUserTheme();

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const ContentComponent = scrollable ? BottomSheetScrollView : BottomSheetView;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={SheetBackdrop}
      backgroundStyle={{
        backgroundColor: hexColors.bgSecondary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTopWidth: 1,
        borderColor: hexColors.border,
      }}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: hexColors.textMuted,
        width: 36,
        height: 4,
      }}
      snapPoints={customSnapPoints ?? DEFAULT_SNAP_POINTS}
      onDismiss={onClose}
    >
      <ContentComponent style={styles.contentContainer}>{children}</ContentComponent>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
