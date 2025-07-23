export interface Category {
  name: string;
  count: number;
  active: boolean;
}

export interface SortOption {
  name: string;
  active: boolean;
}

export interface Memo {
  id: number;
  title: string;
  category: string;
  content: string;
  rating: number;
  timeAgo: string;
}