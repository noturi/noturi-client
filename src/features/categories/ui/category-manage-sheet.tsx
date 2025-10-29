import { Sheet, YStack } from 'tamagui';

import { CategoryManageContent } from './category-manage-content';
import { CategoryManageHeader } from './category-manage-header';

interface CategoryManageSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManageSheet = ({ isOpen, onClose }: CategoryManageSheetProps) => {
  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      animation="quick"
      open={isOpen}
      snapPoints={[85, 50]}
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

        <CategoryManageHeader onClose={onClose} />
        <CategoryManageContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </Sheet.Frame>
    </Sheet>
  );
};
