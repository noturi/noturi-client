import type { Href } from 'expo-router';

export const HREFS = {
  login: (): Href => '/login',
  tabs: (): Href => '/(tabs)',
  search: (): Href => '/search',
  memoDetail: (id: string): Href => `/memo/${id}`,
  memoEdit: (id: string): Href => `/memo/edit/${id}`,
  memoCreate: (): Href => '/memo/create',
} as const;

export const ROUTES = {
  root: { name: 'index', label: '홈' },
  login: { name: 'login', label: '로그인' },
  tabs: { name: '(tabs)', label: '탭' },
  memoDetail: { name: 'memo/[id]', label: '메모 상세' },
  memoEdit: { name: 'memo/edit/[id]', label: '메모 수정' },
  search: { name: 'search', label: '검색' },
  memoCreate: { name: 'memo/create/index', label: '메모 작성' },
} as const;
