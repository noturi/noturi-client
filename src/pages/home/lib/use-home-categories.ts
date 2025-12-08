import type { UICategory } from '~/entities/category';
import { activeCategoriesQuery } from '~/features/categories/api';
import { CategoryService } from '~/features/categories/model';

import { useCallback, useMemo, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

export function useHomeCategories() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const { data: categoriesData } = useSuspenseQuery(activeCategoriesQuery());

  const selectedCategoryId = CategoryService.getCategoryIdByName(
    selectedCategory,
    categoriesData?.categories,
  );

  const categories: UICategory[] = useMemo(
    () => CategoryService.transformToUICategories(categoriesData?.categories, selectedCategory),
    [categoriesData?.categories, selectedCategory],
  );

  const handleCategoryPress = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
  }, []);

  return {
    categories,
    selectedCategoryId,
    handleCategoryPress,
  };
}
