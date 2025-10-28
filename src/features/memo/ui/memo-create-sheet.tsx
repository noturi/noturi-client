import { Sheet, YStack } from 'tamagui';

import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { MemoFormContent } from './memo-form-content';
import { MemoFormHeader } from './memo-form-header';

interface MemoCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoCreateSheet = ({ isOpen, onClose }: MemoCreateSheetProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      animation="quick"
      open={isOpen}
      snapPoints={keyboardHeight > 0 ? [85] : [85, 50]}
      snapPointsMode="percent"
      onOpenChange={onClose}
    >
      <Sheet.Overlay
        animation="quick"
        backgroundColor="$backgroundOverlay"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame
        backgroundColor="$backgroundPrimary"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        <YStack alignItems="center" paddingBottom="$2" paddingTop="$2">
          <YStack backgroundColor="$textMuted" borderRadius="$2" height={4} width={36} />
        </YStack>

        <MemoFormHeader onClose={onClose} />
        <MemoFormContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </Sheet.Frame>
    </Sheet>
  );
};
