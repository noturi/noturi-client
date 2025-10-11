import { XStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { X } from '@tamagui/lucide-icons';

interface CategoryManageHeaderProps {
  onClose: () => void;
}

export const CategoryManageHeader = ({ onClose }: CategoryManageHeaderProps) => {
  return (
    <XStack
      alignItems="center"
      borderBottomColor="$border"
      borderBottomWidth={1}
      paddingHorizontal="$2"
      paddingVertical="$3"
      position="relative"
    >
      <XStack
        backgroundColor="$backgroundTransparent"
        borderRadius="$4"
        paddingHorizontal="$3"
        paddingVertical="$2"
        pressStyle={{ opacity: 0.7 }}
        onPress={onClose}
      >
        <X color="$textSecondary" size="$4" />
      </XStack>
      <Typography left={0} position="absolute" right={0} textAlign="center" variant="title3">
        카테고리 관리
      </Typography>
    </XStack>
  );
};
