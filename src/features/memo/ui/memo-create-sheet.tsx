import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/application/providers/theme-provider';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';

import { MemoFormContent } from './memo-form-content';
import { MemoFormHeader } from './memo-form-header';

interface MemoCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoCreateSheet = ({ isOpen, onClose }: MemoCreateSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['85%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

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

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: hexColors.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderColor: hexColors.border,
        borderBottomWidth: 0,
      }}
      handleIndicatorStyle={{
        backgroundColor: hexColors.textMuted,
        width: 36,
        height: 4,
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      snapPoints={snapPoints}
      onDismiss={onClose}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="items-center py-2">
          <View className="h-1 w-9 rounded-2" style={{ backgroundColor: hexColors.textMuted }} />
        </View>
        <MemoFormHeader onClose={onClose} />
        <MemoFormContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};
