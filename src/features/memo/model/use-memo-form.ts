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

import { useState } from 'react';

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

  // 수정 모드: 서버 데이터가 도착/변경되면 폼을 그 값으로 초기화
  // (effect 대신 렌더 중 상태 조정 — https://react.dev/learn/you-might-not-need-an-effect)
  const [loadedMemo, setLoadedMemo] = useState(memo);
  if (memo !== loadedMemo) {
    setLoadedMemo(memo);
    if (memo) {
      form.reset({
        text: joinMemoText(memo),
        rating: Number(memo.rating) || 0,
        selectedCategory: memo.category?.name || '',
      });
    }
  }

  return {
    form,
    isEdit,
    isLoadingMemo: isEdit && isLoading,
    isSubmitting: isEdit ? updateMutation.isPending : createMutation.isPending,
  };
}
