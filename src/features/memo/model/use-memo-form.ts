import { useState } from 'react';

export interface MemoFormData {
  title: string;
  memoContent: string;
  rating: number;
  selectedCategory: string;
}

export const useMemoForm = () => {
  const [formData, setFormData] = useState<MemoFormData>({
    title: '',
    memoContent: '',
    rating: 0,
    selectedCategory: '',
  });

  const updateField = (field: keyof MemoFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      memoContent: '',
      rating: 0,
      selectedCategory: '',
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) return false;
    if (!formData.memoContent.trim()) return false;
    if (!formData.selectedCategory) return false;
    return true;
  };

  const handleCategorySelect = (categoryName: string) => {
    updateField('selectedCategory', categoryName);
  };

  return {
    formData,
    updateField,
    resetForm,
    validateForm,
    handleCategorySelect,
  };
};
