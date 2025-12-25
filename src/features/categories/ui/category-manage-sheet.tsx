import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['40%', '60%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
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
        backgroundColor: hexColors.bgPrimary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      enablePanDownToClose
      handleIndicatorStyle={{
        backgroundColor: hexColors.textMuted,
        width: 36,
        height: 4,
      }}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="gap-4 p-4 pb-6">
          <Typography className="text-center" variant="headline">
            카테고리 관리
          </Typography>
        </View>
        <CategoryManageContent shouldAutoFocus={isOpen} onSuccess={onClose} />
      </BottomSheetView>
    </BottomSheet>
  );
};
