import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';

import { forwardRef, ReactNode, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

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
  ({ children, snapPoints: customSnapPoints, onClose, enablePanDownToClose = true, scrollable = false }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { currentTheme } = useUserTheme();

    const bgColor = rgbToHex(currentTheme.colors.bgSecondary);
    const borderColor = rgbToHex(currentTheme.colors.border);
    const textMuted = rgbToHex(currentTheme.colors.textMuted);

    const snapPoints = useMemo(() => customSnapPoints || ['50%', '90%'], [customSnapPoints]);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      [],
    );

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
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: bgColor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderTopWidth: 1,
          borderColor: borderColor,
        }}
        enablePanDownToClose={enablePanDownToClose}
        handleIndicatorStyle={{
          backgroundColor: textMuted,
          width: 36,
          height: 4,
        }}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <ContentComponent style={styles.contentContainer}>
          {children}
        </ContentComponent>
      </BottomSheet>
    );
  },
);

Sheet.displayName = 'Sheet';

// Controlled Sheet that uses open state
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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { currentTheme } = useUserTheme();

  const bgColor = rgbToHex(currentTheme.colors.bgSecondary);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);

  const snapPoints = useMemo(() => customSnapPoints || ['50%', '90%'], [customSnapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const ContentComponent = scrollable ? BottomSheetScrollView : BottomSheetView;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: bgColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTopWidth: 1,
        borderColor: borderColor,
      }}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: textMuted,
        width: 36,
        height: 4,
      }}
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <ContentComponent style={styles.contentContainer}>
        {children}
      </ContentComponent>
    </BottomSheet>
  );
}

// Handle component for manual placement
export function SheetHandle() {
  const { currentTheme } = useUserTheme();
  const textMuted = rgbToHex(currentTheme.colors.textMuted);

  return (
    <View className="items-center py-2">
      <View
        className="rounded-2 h-1 w-9"
        style={{ backgroundColor: textMuted }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
