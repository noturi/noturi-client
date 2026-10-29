import type { Category } from '~/entities/category';
import {
  type CreateMemoDto,
  type MemoFormData,
  memoDetailQuery,
  memoFormSchema,
} from '~/entities/memo';
import { useForm, useToast } from '~/shared/lib';
import { MESSAGES } from '~/shared/model';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useCreateMemoMutation, useUpdateMemoMutation } from '../api';
import { lastMemoCategory } from '../lib/last-category';

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
      form.setError('title', { message: '메모 등록 중 오류가 발생했습니다.', type: 'server' });
    },
  });

  const updateMutation = useUpdateMemoMutation({
    onSuccess: () => {
      toast.showSuccess(MESSAGES.MEMO.UPDATE_SUCCESS);
      onSuccess?.();
    },
    onError: () => {
      form.setError('title', { message: '메모 수정 중 오류가 발생했습니다.', type: 'server' });
    },
  });

  const form = useForm<MemoFormData>({
    initialValues: { title: '', content: '', rating: 0, selectedCategory: '' },
    validationSchema: memoFormSchema,
    onSubmit: async (values) => {
      const selectedCategory = categories.find((cat) => cat.name === values.selectedCategory);
      const memoData: CreateMemoDto = {
        title: values.title,
        content: values.content,
        ...(selectedCategory && { categoryId: selectedCategory.id }),
        ...(values.rating > 0 && { rating: values.rating }),
      };

      if (memoId) {
        updateMutation.mutate({ ...memoData, id: memoId });
      } else {
        createMutation.mutate(memoData);
        void lastMemoCategory.set(selectedCategory?.id);
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
        title: memo.title,
        content: memo.content ?? '',
        rating: Number(memo.rating) || 0,
        selectedCategory: memo.category?.name || '',
      });
    }
  }

  // 생성 모드: 마지막으로 쓴 카테고리를 미리 선택 (아직 아무것도 고르지 않았을 때만)
  const hasCategories = categories.length > 0;
  useEffect(() => {
    if (isEdit || !hasCategories) return;
    let cancelled = false;
    void lastMemoCategory.get().then((categoryId) => {
      const last = categories.find((cat) => cat.id === categoryId);
      if (!cancelled && last && !form.values.selectedCategory) {
        form.setValue('selectedCategory', last.name);
      }
    });
    return () => {
      cancelled = true;
    };
    // 카테고리 목록이 처음 도착했을 때 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, hasCategories]);

  return {
    form,
    isEdit,
    isLoadingMemo: isEdit && isLoading,
    isSubmitting: isEdit ? updateMutation.isPending : createMutation.isPending,
  };
}
