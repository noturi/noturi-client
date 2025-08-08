export interface SortOption {
  name: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  rating: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
