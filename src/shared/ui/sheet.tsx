import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useUserTheme } from '~/shared/lib/theme-context';

import { type ReactNode, useEffect, useRef } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Typography } from './typography';

// 모든 바텀시트 공통 backdrop — backdropComponent에 그대로 전달
export function SheetBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      pressBehavior="close"
    />
  );
}

type HexColors = ReturnType<typeof useUserTheme>['hexColors'];

/**
 * 시트 배경 프리셋 — 배경색과 테두리(면)를 한 묶음으로 관리한다.
 * 새 룩이 필요하면 여기에 항목을 추가한다 (호출부에 boolean을 늘리지 않는다)
 */
const SHEET_BACKGROUNDS = {
  /** bgSecondary + 위쪽 테두리만 */
  secondary: (colors: HexColors): ViewStyle => ({
    backgroundColor: colors.bgSecondary,
    borderTopWidth: 1,
  }),
  /** surface + 위/좌/우 테두리 (폼 입력 시트) */
  surface: (colors: HexColors): ViewStyle => ({
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderBottomWidth: 0,
  }),
} satisfies Record<string, (colors: HexColors) => ViewStyle>;

export type SheetBackground = keyof typeof SHEET_BACKGROUNDS;

/** 모듈 상수 — bottom-sheet가 snapPoints 배열 참조로 재계산하므로 렌더마다 새로 만들지 않는다 */
const DEFAULT_SNAP_POINTS = ['50%', '90%'];

interface ControlledSheetProps {
  children: ReactNode;
  /** true면 present, false면 dismiss */
  isOpen: boolean;
  /** 어떤 경로로든(아래로 스와이프, backdrop 탭, isOpen=false) 시트가 닫히면 호출 */
  onClose: () => void;
  /** 상단 가운데 제목 — 콘텐츠와 함께 스크롤된다 */
  title?: ReactNode;
  snapPoints?: (string | number)[];
  background?: SheetBackground;
  /** true면 BottomSheetScrollView (탭 시 키보드 유지: keyboardShouldPersistTaps="handled") */
  scrollable?: boolean;
  /** scrollable일 때 스크롤 인디케이터 표시 여부 */
  showsScrollIndicator?: boolean;
  /** 스크롤 영역 밖, 시트 위에 고정되는 요소 (예: 절대 위치 FloatingButton) */
  overlay?: ReactNode;
}

/**
 * 앱의 유일한 바텀시트 구현 — BottomSheetModal(Portal로 탭 위에 렌더)을 isOpen으로 제어한다.
 * present/dismiss 동기화, 테마 배경·핸들, backdrop, snapPoints, 스크롤 콘텐츠를 담당
 */
export function ControlledSheet({
  children,
  isOpen,
  onClose,
  title,
  snapPoints = DEFAULT_SNAP_POINTS,
  background = 'secondary',
  scrollable = false,
  showsScrollIndicator = true,
  overlay,
}: ControlledSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { hexColors } = useUserTheme();

  // 실제로 열려 있을 때만 dismiss() — 열린 적 없는 모달에 dismiss()를 호출하면
  // 이후 present()가 아무것도 그리지 않는 버그 회피 (gorhom/react-native-bottom-sheet#2787, 5.2.11+)
  const isPresentedRef = useRef(false);
  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present();
      isPresentedRef.current = true;
    } else if (isPresentedRef.current) {
      bottomSheetRef.current?.dismiss();
      isPresentedRef.current = false;
    }
  }, [isOpen]);

  // 팬다운/배경 탭으로 닫힌 경우 이미 dismiss 상태이므로 다시 dismiss()하지 않도록 기록
  const handleDismiss = () => {
    isPresentedRef.current = false;
    onClose();
  };

  const header = title ? (
    <View className="px-4 pt-4">
      <Typography className="text-center" variant="headline">
        {title}
      </Typography>
    </View>
  ) : null;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={SheetBackdrop}
      backgroundStyle={{
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderColor: hexColors.border,
        ...SHEET_BACKGROUNDS[background](hexColors),
      }}
      enableDynamicSizing={false}
      handleIndicatorStyle={{
        backgroundColor: hexColors.textMuted,
        width: 36,
        height: 4,
      }}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
    >
      {scrollable ? (
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={showsScrollIndicator}
          style={styles.content}
        >
          {header}
          {children}
        </BottomSheetScrollView>
      ) : (
        <BottomSheetView style={styles.content}>
          {header}
          {children}
        </BottomSheetView>
      )}
      {overlay}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
