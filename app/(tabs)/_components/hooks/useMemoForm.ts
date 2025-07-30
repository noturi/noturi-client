import { useState } from "react";

export interface MemoFormData {
  memoContent: string;
  selectedCategory: string;
  newCategory: string;
  rating: number;
  description: string;
}

export const useMemoForm = () => {
  const [formData, setFormData] = useState<MemoFormData>({
    memoContent: "",
    selectedCategory: "",
    newCategory: "",
    rating: 0,
    description: "",
  });

  const updateField = <K extends keyof MemoFormData>(
    field: K,
    value: MemoFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      memoContent: "",
      selectedCategory: "",
      newCategory: "",
      rating: 0,
      description: "",
    });
  };

  const handleCategorySelect = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: categoryName,
      newCategory: "",
    }));
  };

  return {
    formData,
    updateField,
    resetForm,
    handleCategorySelect,
  };
};