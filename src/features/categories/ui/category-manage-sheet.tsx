import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/features/theme';
import { Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';

import { CategoryManageContent } from './category-manage-content';

interface CategoryManageSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManageSheet = ({ isOpen, onClose }: CategoryManageSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['60%'], []);

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
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: hexColors.surface,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderWidth: 1,
        borderColor: hexColors.border,
        borderBottomWidth: 0,
      }}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: hexColors.textMuted,
        width: 36,
        height: 4,
      }}
      snapPoints={snapPoints}
      onDismiss={onClose}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="gap-4 p-4 pb-6">
          <Typography className="text-center" variant="headline">
            카테고리 관리
          </Typography>
        </View>
        <CategoryManageContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </BottomSheetView>
    </BottomSheetModal>
  );
};
