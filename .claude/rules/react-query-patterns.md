# React Query 패턴

## 네이밍

- Query: `memoListQuery`, `memoDetailQuery` — `queryOptions` 반환 (entities)
- Infinite: `infiniteMemoListQuery` — `infiniteQueryOptions` 반환
- Mutation: `useCreateMemoMutation`, `useUpdateMemoMutation` — `useMutation` 반환 (features)
- Query Key는 반드시 `QUERY_KEYS` 상수 사용 (`~/shared/lib`)

## Entity Query 패턴

```typescript
// entities/memo/api/queries.ts
export const memoDetailQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.memo(id),
    queryFn: () => memoApi.getMemo(id),
    enabled: !!id,
  });
```

## Feature Mutation 패턴

```typescript
// features/memo/api/mutations.ts
export function useCreateMemoMutation(
  options: Pick<
    UseMutationOptions<Memo, DefaultError, CreateMemoDto>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['memo', 'create', ...mutationKey],
    mutationFn: (data: CreateMemoDto) => memoMutationApi.createMemo(data),
    onMutate,
    onSuccess: async (newMemo, createData, context) => {
      await invalidateMemoRelatedCache(queryClient);
      await onSuccess?.(newMemo, createData, context);
    },
    onError, // ⚠️ 옵션으로 받았으면 반드시 useMutation에 전달 (누락 버그 주의)
    onSettled,
  });
}
```

## 캐시 무효화는 헬퍼로 중앙화

mutation마다 invalidate 블록을 복붙하지 말고 슬라이스 `lib/`에 헬퍼를 둔다:

- `features/memo/lib/invalidate-memo-cache.ts` → `invalidateMemoRelatedCache(queryClient)`
- `features/todo/lib/invalidate-todo-cache.ts` → `invalidateTodoByDate`, `invalidateTodoStats`

## 전역 설정 (shared/api/query-client.ts)

- `staleTime: 1분`, `gcTime: 5분`, `retry: false`, refetchOnWindowFocus/Reconnect 비활성
- **mutations 전역 onError가 Alert를 띄움** — mutation 훅에 onError를 넘기면 전역 onError는 대체됨
  (폼 에러로 처리하고 싶으면 훅 레벨 onError를 정의할 것)
