import type { Category } from '~/entities/category';
import {
  type CreateMemoDto,
  type MemoFormData,
  joinMemoText,
  memoDetailQuery,
  memoFormSchema,
  splitMemoText,
} from '~/entities/memo';
import { useForm, useToast } from '~/shared/lib';
import { MESSAGES } from '~/shared/model';

import { useEffect, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useCreateMemoMutation, useUpdateMemoMutation } from '../api';

interface UseMemoFormOptions {
  /** 있으면 수정 모드, 없으면 생성 모드 */
  memoId?: string;
  categories: Category[];
  onSuccess?: () => void;
}

/** 메모 생성/수정 폼의 상태·검증·저장 로직 (UI와 분리) */
export function useMemoForm({ memoId, categories, onSuccess }: UseMemoFormOptions) {
  const isEdit = !!memoId;
  const toast = useToast();
  const { data: memo, isLoading } = useQuery(memoDetailQuery(memoId ?? ''));

  const createMutation = useCreateMemoMutation({
    onSuccess: () => {
      toast.showSuccess(MESSAGES.MEMO.CREATE_SUCCESS);
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      form.setError('text', { message: '메모 등록 중 오류가 발생했습니다.', type: 'server' });
    },
  });

  const updateMutation = useUpdateMemoMutation({
    onSuccess: () => {
      toast.showSuccess(MESSAGES.MEMO.UPDATE_SUCCESS);
      onSuccess?.();
    },
    onError: () => {
      form.setError('text', { message: '메모 수정 중 오류가 발생했습니다.', type: 'server' });
    },
  });

  const form = useForm<MemoFormData>({
    initialValues: { text: '', rating: 0, selectedCategory: '' },
    validationSchema: memoFormSchema,
    onSubmit: async (values) => {
      const selectedCategory = categories.find((cat) => cat.name === values.selectedCategory);
      const memoData: CreateMemoDto = {
        ...splitMemoText(values.text),
        ...(selectedCategory && { categoryId: selectedCategory.id }),
        ...(values.rating > 0 && { rating: values.rating }),
      };

      if (memoId) {
        updateMutation.mutate({ ...memoData, id: memoId });
      } else {
        createMutation.mutate(memoData);
      }
    },
  });

  // setValue는 폼 상태마다 새로 생성되므로 최신 참조만 ref로 보관 (effect는 memo 변경 시에만 실행)
  const setValueRef = useRef(form.setValue);
  setValueRef.current = form.setValue;

  // 수정 모드: 서버 데이터로 폼 채우기
  useEffect(() => {
    if (!memo) return;
    setValueRef.current('text', joinMemoText(memo));
    setValueRef.current('rating', Number(memo.rating) || 0);
    setValueRef.current('selectedCategory', memo.category?.name || '');
  }, [memo]);

  return {
    form,
    isEdit,
    isLoadingMemo: isEdit && isLoading,
    isSubmitting: isEdit ? updateMutation.isPending : createMutation.isPending,
  };
}
