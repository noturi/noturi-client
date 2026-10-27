import type { Category } from '~/entities/category';
import { activeCategoriesQuery } from '~/entities/category';
import { GripVertical } from '~/shared/lib/icons';
import { Button, Form } from '~/shared/ui';

import { useState } from 'react';
import { Pressable, View } from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useQuery } from '@tanstack/react-query';

import { useReorderCategoriesMutation } from '../api/mutations';
import { CategoryDeleteButton } from './category-delete-button';
import { CategoryInlineAddForm } from './category-inline-add-form';

interface CategoryManageContentProps {
  shouldAutoFocus?: boolean;
  onSuccess?: () => void;
}

export const CategoryManageContent = ({
  shouldAutoFocus = false,
  onSuccess,
}: CategoryManageContentProps) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data: categoriesData } = useQuery(activeCategoriesQuery());
  const categories = categoriesData?.categories || [];

  const reorderMutation = useReorderCategoriesMutation();

  const handleCreated = () => {
    setIsFormVisible(false);
    onSuccess?.();
  };

  const handleDragEnd = ({ data }: { data: Category[] }) => {
    reorderMutation.mutate({
      categories: data.map((cat, index) => ({ id: cat.id, sortOrder: index })),
    });
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Category>) => (
    <ScaleDecorator>
      <Pressable
        className={`flex-row items-center gap-2 py-2 ${isActive ? 'opacity-80' : ''}`}
        disabled={isActive}
        onLongPress={drag}
      >
        <GripVertical className="text-text-muted" size={16} />
        <CategoryDeleteButton
          categoryId={item.id}
          categoryName={item.name}
          disabled={categories.length <= 1}
          memoCount={item.memoCount}
        />
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
                onCreated={handleCreated}
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
                data={categories}
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
