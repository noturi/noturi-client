import { Sheet, YStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { CategoryManageContent } from './category-manage-content';

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
      snapPoints={[60, 40]}
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
        <YStack gap="$4" padding="$4" paddingBottom="$6">
          <Typography textAlign="center" variant="headline">
            카테고리 관리
          </Typography>
        </YStack>
        <CategoryManageContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </Sheet.Frame>
    </Sheet>
  );
};
