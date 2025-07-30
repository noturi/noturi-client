import { useState } from "react";

export interface MemoFormData {
  title: string;
  memoContent: string;
  selectedCategory: string;
  newCategory: string;
  rating: number;
}

export const useMemoForm = () => {
  const [formData, setFormData] = useState<MemoFormData>({
    title: "",
    memoContent: "",
    selectedCategory: "",
    newCategory: "",
    rating: 0,
  });

  const updateField = <K extends keyof MemoFormData>(
    field: K,
    value: MemoFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      memoContent: "",
      selectedCategory: "",
      newCategory: "",
      rating: 0,
    });
  };

  const handleCategorySelect = (categoryName: string) => {
    setFormData((prev) => ({
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
