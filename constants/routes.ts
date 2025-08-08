import type { Href } from 'expo-router';

export const ROUTES = {
  root: {
    name: 'index',
    path: '/',
    href: '/',
    label: '',
  },
  auth: {
    name: '(auth)',
    path: '/(auth)',
    href: '/(auth)',
    label: '',
  },
  login: {
    name: '(auth)/login',
    path: '/(auth)/login',
    href: '/(auth)/login',
    label: '로그인',
  },
  tabs: {
    name: '(tabs)',
    path: '/(tabs)',
    href: '/(tabs)',
    label: '',
  },
  home: {
    name: '(home)/home',
    path: '/home',
    href: '/(home)/home',
    label: '홈',
  },
  search: {
    name: '(search)/search',
    path: '/search',
    href: '/(search)/search',
    label: '검색',
  },
  memoDetail: {
    name: 'memo/[id]',
    path: (id: string) => `/memo/${id}`,
    href: '/memo/[id]',
    label: '메모',
  },
  memoEdit: {
    name: 'memo/edit/[id]',
    path: (id: string) => `/memo/edit/${id}`,
    href: '/memo/edit/[id]',
    label: '메모 수정',
  },
  create: {
    name: 'create',
    path: '/create',
    href: '/create',
    label: '메모 작성',
  },
} as const;

export const HREFS = {
  root: (): Href => ({ pathname: ROUTES.root.href }),
  search: (): Href => ({ pathname: ROUTES.search.href }),
  memoDetail: (id: string): Href => ({
    pathname: ROUTES.memoDetail.href,
    params: { id },
  }),
  memoEdit: (id: string): Href => ({
    pathname: ROUTES.memoEdit.href,
    params: { id },
  }),
  create: (): Href => ({ pathname: ROUTES.create.href }),
} as const;
