import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/shared/lib/theme-context';

import {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet, View } from 'react-native';

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

export interface SheetRef {
  open: () => void;
  close: () => void;
}

interface SheetProps {
  children: ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  enablePanDownToClose?: boolean;
  scrollable?: boolean;
}

export const Sheet = forwardRef<SheetRef, SheetProps>(
  (
    {
      children,
      snapPoints: customSnapPoints,
      onClose,
      enablePanDownToClose = true,
      scrollable = false,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { hexColors } = useUserTheme();

    const snapPoints = useMemo(() => customSnapPoints || ['50%', '90%'], [customSnapPoints]);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose],
    );

    const ContentComponent = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={SheetBackdrop}
        backgroundStyle={{
          backgroundColor: hexColors.bgSecondary,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderTopWidth: 1,
          borderColor: hexColors.border,
        }}
        enablePanDownToClose={enablePanDownToClose}
        handleIndicatorStyle={{
          backgroundColor: hexColors.textMuted,
          width: 36,
          height: 4,
        }}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <ContentComponent style={styles.contentContainer}>{children}</ContentComponent>
      </BottomSheet>
    );
  },
);

Sheet.displayName = 'Sheet';

// Controlled Sheet that uses BottomSheetModal (renders above tabs via Portal)
interface ControlledSheetProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: (string | number)[];
  scrollable?: boolean;
}

export function ControlledSheet({
  children,
  isOpen,
  onClose,
  snapPoints: customSnapPoints,
  scrollable = false,
}: ControlledSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => customSnapPoints || ['50%', '90%'], [customSnapPoints]);

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
      snapPoints={snapPoints}
      onDismiss={onClose}
    >
      <ContentComponent style={styles.contentContainer}>{children}</ContentComponent>
    </BottomSheetModal>
  );
}

// Handle component for manual placement
export function SheetHandle() {
  return (
    <View className="items-center py-2">
      <View className="h-1 w-9 rounded-2 bg-text-muted" />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
