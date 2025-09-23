import { XStack } from 'tamagui';
import { Typography } from '~/shared/ui';

import { X } from '@tamagui/lucide-icons';

interface MemoFormHeaderProps {
  onClose: () => void;
}

export const MemoFormHeader = ({ onClose }: MemoFormHeaderProps) => {
  return (
    <XStack
      alignItems="center"
      backgroundColor="$backgroundPrimary"
      borderBottomColor="$borderPrimary"
      borderBottomWidth={0.5}
      height={44}
      justifyContent="center"
      paddingHorizontal="$4"
      position="relative"
    >
      <XStack
        alignItems="center"
        backgroundColor="transparent"
        borderRadius="$2"
        height={44}
        justifyContent="center"
        left="$4"
        paddingHorizontal="$2"
        position="absolute"
        pressStyle={{ opacity: 0.5 }}
        width={44}
        onPress={onClose}
      >
        <X color="$primary" size="$5" strokeWidth={2} />
      </XStack>
      
      <Typography color="$textPrimary" fontWeight="600" variant="headline">
        새 메모
      </Typography>
    </XStack>
  );
};
