export const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,

  refetchOnReconnect: true,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
} as const;

export const REALTIME_QUERY_OPTIONS = {
  staleTime: 0,
  cacheTime: 2 * 60 * 1000,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
} as const;

export const STATIC_QUERY_OPTIONS = {
  staleTime: 30 * 60 * 1000,
  cacheTime: 60 * 60 * 1000,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
} as const;
