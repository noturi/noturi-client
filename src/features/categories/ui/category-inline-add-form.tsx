import { type Category, type CategoryFormData, categoryFormSchema } from '~/entities/category';
import { DEFAULT_COLORS } from '~/shared/config';
import { useForm, useToast } from '~/shared/lib';
import { MESSAGES } from '~/shared/model';
import { Button, Form, Input } from '~/shared/ui';

import { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';

import { useCreateCategoryMutation } from '../api/mutations';
import { getCategoryCreateErrorMessage } from '../model/form-error-handler';

export interface CategoryInlineAddFormProps {
  onCreated?: (category: Category) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

/** 카테고리 이름 입력 + 생성. 카테고리 생성 UI는 이 컴포넌트 하나로만 제공한다. */
export function CategoryInlineAddForm({
  onCreated,
  onCancel,
  autoFocus = true,
}: CategoryInlineAddFormProps) {
  const inputRef = useRef<TextInput>(null);
  const toast = useToast();

  const form = useForm<CategoryFormData>({
    initialValues: { name: '' },
    validationSchema: categoryFormSchema,
  });

  const createMutation = useCreateCategoryMutation({
    onSuccess: (newCategory) => {
      toast.showSuccess(MESSAGES.CATEGORY.CREATE_SUCCESS);
      form.reset();
      onCreated?.(newCategory);
    },
    // 전역 Alert 대신 입력 필드에 표시
    onError: async (error) => {
      form.setError('name', {
        message: await getCategoryCreateErrorMessage(error),
        type: 'server',
      });
    },
  });

  // 바텀시트/레이아웃 애니메이션 후 포커스
  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <View className="mt-2 flex-row items-center gap-1">
      <View className="flex-1">
        <Form.Field error={form.shouldShowError('name') ? form.errors.name : undefined}>
          <Input
            ref={inputRef}
            hasError={!!form.shouldShowError('name')}
            maxLength={20}
            placeholder="새 카테고리 이름"
            value={form.values.name}
            onBlur={() => form.setTouched('name')}
            onChangeText={(text) => form.setValue('name', text)}
            onFocus={() => form.clearError('name')}
          />
        </Form.Field>
      </View>
      <View className="flex-row items-center gap-1">
        <Button
          isDisabled={!form.isValid || createMutation.isPending}
          size="sm"
          variant="primary"
          onPress={() =>
            createMutation.mutate({ name: form.values.name.trim(), color: DEFAULT_COLORS })
          }
        >
          <Button.Label>추가</Button.Label>
        </Button>
        <Button size="sm" variant="ghost" onPress={handleCancel}>
          <Button.Label>취소</Button.Label>
        </Button>
      </View>
    </View>
  );
}
