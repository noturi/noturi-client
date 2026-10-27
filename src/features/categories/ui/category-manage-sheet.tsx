import { ControlledSheet } from '~/shared/ui';

import { View } from 'react-native';

import { CategoryManageContent } from './category-manage-content';

/** 모듈 상수 — bottom-sheet가 snapPoints 배열 참조로 재계산하므로 렌더마다 새로 만들지 않는다 */
const SNAP_POINTS = ['60%'];

interface CategoryManageSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManageSheet = ({ isOpen, onClose }: CategoryManageSheetProps) => (
  <ControlledSheet
    background="surface"
    isOpen={isOpen}
    snapPoints={SNAP_POINTS}
    title="카테고리 관리"
    onClose={onClose}
  >
    {/* 제목 아래 간격(pb-6) 유지 */}
    <View className="flex-1 pt-6">
      <CategoryManageContent shouldAutoFocus={isOpen} onSuccess={onClose} />
    </View>
  </ControlledSheet>
);
