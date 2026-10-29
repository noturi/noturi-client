import type { Category } from '~/entities/category';
import {
  ALL_CATEGORY_ID,
  ALL_CATEGORY_NAME,
  activeCategoriesQuery,
  insertAllCategory,
  toReorderPayload,
} from '~/entities/category';
import { type UserSettings, userSettingsQuery } from '~/entities/user';
import { QUERY_KEYS } from '~/shared/lib';
import { GripVertical } from '~/shared/lib/icons';
import { Button, Form, Typography } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, View } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useReorderCategoriesMutation } from '../api/mutations';
import { CategoryDeleteButton } from './category-delete-button';
import { CategoryInlineAddForm } from './category-inline-add-form';

/** 관리 목록의 한 줄 — 실제 카테고리 또는 홈의 "전체" 탭 (순서만 바꿀 수 있음) */
type ManageItem = { id: typeof ALL_CATEGORY_ID } | Category;

const ALL_ITEM = { id: ALL_CATEGORY_ID } as const;

interface CategoryManageContentProps {
  shouldAutoFocus?: boolean;
}

export const CategoryManageContent = ({ shouldAutoFocus = false }: CategoryManageContentProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const queryClient = useQueryClient();
  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const { data: settings } = useQuery(userSettingsQuery());
  const categories = categoriesData?.categories || [];
  const items: ManageItem[] = insertAllCategory(categories, ALL_ITEM, settings?.allCategoryOrder);

  const reorderMutation = useReorderCategoriesMutation({
    // 실패하면 서버 값으로 되돌림
    onError: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userSettings }),
  });

  const handleDragEnd = ({ data }: { data: ManageItem[] }) => {
    const payload = toReorderPayload(data.map((item) => item.id));
    // 놓은 자리에 바로 보이도록 캐시를 먼저 갱신 (응답을 기다리면 원래 자리로 튀었다 돌아옴)
    queryClient.setQueryData(activeCategoriesQuery().queryKey, (prev) =>
      prev
        ? { ...prev, categories: data.filter((item): item is Category => 'name' in item) }
        : prev,
    );
    queryClient.setQueryData<UserSettings>(QUERY_KEYS.userSettings, (prev) =>
      prev ? { ...prev, allCategoryOrder: payload.allCategoryOrder } : prev,
    );
    reorderMutation.mutate(payload);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ManageItem>) => (
    <ScaleDecorator>
      <Pressable
        className={`flex-row items-center gap-2 py-2 ${isActive ? 'opacity-80' : ''}`}
        disabled={isActive}
        onLongPress={drag}
      >
        <GripVertical className="text-text-muted" size={16} />
        {'name' in item ? (
          <CategoryDeleteButton
            categoryId={item.id}
            categoryName={item.name}
            disabled={categories.length <= 1}
            memoCount={item.memoCount}
          />
        ) : (
          // "전체"는 실제 카테고리가 아니라 삭제·이름 변경 없이 순서만
          <View className="rounded-4 border border-dashed border-border px-3 py-2">
            <Typography variant="caption1">{ALL_CATEGORY_NAME}</Typography>
          </View>
        )}
      </Pressable>
    </ScaleDecorator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 p-4" onStartShouldSetResponder={() => true}>
        <Form>
          <Form.Field>
            {isFormVisible ? (
              <CategoryInlineAddForm
                autoFocus={shouldAutoFocus || isFormVisible}
                onCancel={() => setIsFormVisible(false)}
                onCreated={() => setIsFormVisible(false)} /* 연속 추가·정리할 수 있게 시트는 유지 */
              />
            ) : (
              <Button size="md" variant="ghost" onPress={() => setIsFormVisible(true)}>
                <Button.Label>+ 추가</Button.Label>
              </Button>
            )}
          </Form.Field>

          <Form.Field label="카테고리 (길게 눌러서 순서 변경)">
            <View style={{ maxHeight: 300 }}>
              <DraggableFlatList
                showsVerticalScrollIndicator
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onDragEnd={handleDragEnd}
              />
            </View>
          </Form.Field>
        </Form>
      </View>
    </GestureHandlerRootView>
  );
};
