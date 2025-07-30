import { Category } from "@/services/category/types";
import { Alert } from "react-native";
import { MEMO_ALERTS } from "../constants";
import { MemoFormData } from "../hooks/useMemoForm";

export interface ValidationResult {
  isValid: boolean;
  categoryId?: string;
}

export const validateMemoForm = (
  formData: MemoFormData,
  categories: Category[]
): ValidationResult => {
  const { memoContent, selectedCategory, newCategory } = formData;

  if (!memoContent.trim()) {
    Alert.alert(
      MEMO_ALERTS.VALIDATION.EMPTY_CONTENT.title,
      MEMO_ALERTS.VALIDATION.EMPTY_CONTENT.message
    );
    return { isValid: false };
  }

  const categoryValidation = validateCategory(
    selectedCategory,
    newCategory,
    categories
  );
  if (!categoryValidation.isValid) {
    return { isValid: false };
  }

  return {
    isValid: true,
    categoryId: categoryValidation.categoryId,
  };
};

const validateCategory = (
  selectedCategory: string,
  newCategory: string,
  categories: Category[]
) => {
  if (selectedCategory) {
    const selectedCat = categories.find((cat) => cat.name === selectedCategory);
    if (!selectedCat) {
      Alert.alert(
        MEMO_ALERTS.VALIDATION.CATEGORY_NOT_FOUND.title,
        MEMO_ALERTS.VALIDATION.CATEGORY_NOT_FOUND.message
      );
      return { isValid: false };
    }
    return { isValid: true, categoryId: selectedCat.id };
  }

  if (newCategory.trim()) {
    Alert.alert(
      MEMO_ALERTS.VALIDATION.NEW_CATEGORY_NOT_IMPLEMENTED.title,
      MEMO_ALERTS.VALIDATION.NEW_CATEGORY_NOT_IMPLEMENTED.message
    );
    return { isValid: false };
  }

  Alert.alert(
    MEMO_ALERTS.VALIDATION.NO_CATEGORY.title,
    MEMO_ALERTS.VALIDATION.NO_CATEGORY.message
  );
  return { isValid: false };
};
