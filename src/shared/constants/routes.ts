import type { Href } from 'expo-router';

export const ROUTES = {
  root: {
    name: 'index',
    path: '/',
    href: '/',
    label: '',
  },
  login: {
    name: 'login',
    path: '/login',
    href: '/login',
    label: '로그인',
  },
  tabs: {
    name: '(tabs)',
    path: '/(tabs)',
    href: '/(tabs)',
    label: '',
  },
  home: {
    name: '(home)',
    path: '/(tabs)/(home)',
    href: '/(tabs)',
    label: '홈',
  },
  search: {
    name: 'search',
    path: '/search',
    href: '/search',
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
  memoCreateRating: {
    name: 'memo/create/rating',
    path: '/memo/create/rating',
    href: '/memo/create/rating',
    label: '별점 메모 작성',
  },
  memoCreateText: {
    name: 'memo/create/text',
    path: '/memo/create/text',
    href: '/memo/create/text',
    label: '일반 메모 작성',
  },
} as const;

export const HREFS = {
  root: (): Href => ({ pathname: ROUTES.root.href as any }),
  login: (): Href => ({ pathname: ROUTES.login.href as any }),
  tabs: (): Href => ({ pathname: ROUTES.tabs.href as any }),
  search: (): Href => ({ pathname: ROUTES.search.href as any }),
  memoDetail: (id: string): Href => ({
    pathname: ROUTES.memoDetail.href as any,
    params: { id },
  }),
  memoEdit: (id: string): Href => ({
    pathname: ROUTES.memoEdit.href as any,
    params: { id },
  }),
  create: (): Href => ({ pathname: ROUTES.create.href as any }),
  memoCreateRating: (): Href => ({ pathname: ROUTES.memoCreateRating.href as any }),
  memoCreateText: (): Href => ({ pathname: ROUTES.memoCreateText.href as any }),
} as const;
