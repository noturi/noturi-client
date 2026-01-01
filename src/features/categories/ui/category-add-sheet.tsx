import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/application/providers/theme-provider';
import { useCreateCategoryMutation } from '~/features/categories/api/mutations';
import { X } from '~/shared/lib/icons';
import { Button, Input, Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

interface CategoryAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (categoryName: string) => void;
}

export const CategoryAddSheet = ({ isOpen, onClose, onSuccess }: CategoryAddSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [categoryName, setCategoryName] = useState('');
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const createCategoryMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      setCategoryName('');
      onSuccess?.(newCategory.name);
      onClose();
    },
  });

  const handleCreate = () => {
    createCategoryMutation.mutate({
      name: categoryName.trim(),
      color: '$primary',
    });
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

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
      snapPoints={snapPoints}
      onDismiss={handleClose}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
          <Typography variant="headline">새 카테고리 추가</Typography>
          <Button variant="ghost" onPress={handleClose}>
            <Button.Label>취소</Button.Label>
          </Button>
        </View>

        {/* Content */}
        <View className="gap-4 p-5">
          <View className="gap-2">
            <Typography variant="callout">카테고리 이름</Typography>
            <Input
              maxLength={20}
              placeholder="카테고리 이름을 입력하세요"
              value={categoryName}
              onChangeText={setCategoryName}
            />
          </View>

          <View className="mt-2 flex-row gap-3">
            <Button isIconOnly className="flex-1" variant="ghost" onPress={handleClose}>
              <X className="text-text-secondary" size={20} />
            </Button>
            <Button
              className="flex-1 bg-accent"
              isDisabled={!categoryName.trim() || createCategoryMutation.isPending}
              isLoading={createCategoryMutation.isPending}
              onPress={handleCreate}
            >
              <Button.Label>생성</Button.Label>
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
