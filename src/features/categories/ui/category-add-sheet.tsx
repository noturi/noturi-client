import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { X } from 'lucide-react-native';
import { useCreateCategoryMutation } from '~/features/categories/api/mutations';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { Button, Input, Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface CategoryAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (categoryName: string) => void;
}

export const CategoryAddSheet = ({ isOpen, onClose, onSuccess }: CategoryAddSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [categoryName, setCategoryName] = useState('');
  const { currentTheme } = useUserTheme();

  const bgColor = rgbToHex(currentTheme.colors.bgPrimary);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const accentColor = rgbToHex(currentTheme.colors.accent);
  const surfaceColor = rgbToHex(currentTheme.colors.surface);
  const textSecondary = rgbToHex(currentTheme.colors.textSecondary);

  const snapPoints = useMemo(() => ['40%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
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

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleClose();
      }
    },
    [handleClose],
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
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-5 py-4"
          style={{ borderBottomColor: borderColor, borderBottomWidth: 1 }}
        >
          <Typography variant="headline">새 카테고리 추가</Typography>
          <Button variant="ghost" onPress={handleClose}>
            취소
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
            <Button
              className="flex-1"
              style={{
                backgroundColor: surfaceColor,
                borderColor: borderColor,
                borderWidth: 1,
              }}
              onPress={handleClose}
            >
              <X color={textSecondary} size={20} />
            </Button>
            <Button
              className="flex-1"
              disabled={!categoryName.trim() || createCategoryMutation.isPending}
              style={{ backgroundColor: accentColor }}
              onPress={handleCreate}
            >
              {createCategoryMutation.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Typography color="white" variant="callout">
                  생성
                </Typography>
              )}
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
