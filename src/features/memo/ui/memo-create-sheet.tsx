import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';

import { MemoFormContent } from './memo-form-content';
import { MemoFormHeader } from './memo-form-header';

interface MemoCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoCreateSheet = ({ isOpen, onClose }: MemoCreateSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { currentTheme } = useUserTheme();

  const bgColor = rgbToHex(currentTheme.colors.bgPrimary);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);

  const snapPoints = useMemo(
    () => (keyboardHeight > 0 ? ['85%'] : ['50%', '85%']),
    [keyboardHeight],
  );

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, (e) => {
      const height = Platform.OS === 'ios' ? e.endCoordinates.height : e.endCoordinates.height + 20;
      setKeyboardHeight(height);
    });
    const hideListener = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: bgColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: textMuted,
        width: 36,
        height: 4,
      }}
      index={-1}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="items-center py-2">
          <View
            className="h-1 w-9 rounded-2"
            style={{ backgroundColor: textMuted }}
          />
        </View>
        <MemoFormHeader onClose={onClose} />
        <MemoFormContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </BottomSheetView>
    </BottomSheet>
  );
};
