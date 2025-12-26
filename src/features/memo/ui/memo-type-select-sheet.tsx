import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { FileText, Star } from 'lucide-react-native';
import { useUserTheme } from '~/features/theme';
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
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { hexColors } = useUserTheme();

  const snapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
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
      onDismiss={onClose}
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
              backgroundColor: hexColors.bgSecondary,
              borderColor: hexColors.border,
              borderWidth: 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            onPress={handleSelectRatingMemo}
          >
            <View
              className="items-center justify-center rounded-3 p-3"
              style={{ backgroundColor: hexColors.primary }}
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
              backgroundColor: hexColors.bgSecondary,
              borderColor: hexColors.border,
              borderWidth: 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            onPress={handleSelectTextMemo}
          >
            <View
              className="items-center justify-center rounded-3 p-3"
              style={{ backgroundColor: hexColors.accent }}
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
    </BottomSheetModal>
  );
};
