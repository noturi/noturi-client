import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { FileText, Star } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
import { rgbToHex } from '~/features/theme/model/theme-store';
import { HREFS } from '~/shared/config';
import { Typography } from '~/shared/ui';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';

import { router } from 'expo-router';

interface MemoTypeSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoTypeSelectSheet = ({ isOpen, onClose }: MemoTypeSelectSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { currentTheme } = useUserTheme();

  const bgColor = rgbToHex(currentTheme.colors.bgPrimary);
  const bgSecondary = rgbToHex(currentTheme.colors.bgSecondary);
  const borderColor = rgbToHex(currentTheme.colors.border);
  const textMuted = rgbToHex(currentTheme.colors.textMuted);
  const primaryColor = rgbToHex(currentTheme.colors.primary);
  const accentColor = rgbToHex(currentTheme.colors.accent);

  const snapPoints = useMemo(() => ['45%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSelectRatingMemo = () => {
    onClose();
    setTimeout(() => {
      router.push(HREFS.memoCreate());
    }, 100);
  };

  const handleSelectTextMemo = () => {
    onClose();
    setTimeout(() => {
      router.push(HREFS.memoCreate());
    }, 100);
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
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        <View className="pb-6">
          <Typography className="text-center" variant="title2">
            어떤 메모를 작성할까요?
          </Typography>
          <Typography className="mt-2 text-center" variant="caption1">
            메모 타입을 선택하세요
          </Typography>
        </View>

        <View className="gap-3">
          <Pressable
            className="flex-row items-center gap-4 rounded-4 p-4"
            style={({ pressed }) => ({
              backgroundColor: bgSecondary,
              borderColor: borderColor,
              borderWidth: 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            onPress={handleSelectRatingMemo}
          >
            <View
              className="items-center justify-center rounded-3 p-3"
              style={{ backgroundColor: primaryColor }}
            >
              <Star color="white" fill="white" size={24} />
            </View>
            <View className="flex-1">
              <Typography variant="callout">별점 메모</Typography>
              <Typography className="mt-1" variant="caption2">
                별점과 함께 경험을 기록하세요
              </Typography>
            </View>
          </Pressable>

          <Pressable
            className="flex-row items-center gap-4 rounded-4 p-4"
            style={({ pressed }) => ({
              backgroundColor: bgSecondary,
              borderColor: borderColor,
              borderWidth: 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            onPress={handleSelectTextMemo}
          >
            <View
              className="items-center justify-center rounded-3 p-3"
              style={{ backgroundColor: accentColor }}
            >
              <FileText color="white" size={24} />
            </View>
            <View className="flex-1">
              <Typography variant="callout">일반 메모</Typography>
              <Typography className="mt-1" variant="caption2">
                자유롭게 생각을 기록하세요
              </Typography>
            </View>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};
