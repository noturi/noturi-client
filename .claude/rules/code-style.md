# 코드 스타일

## TypeScript

- `any` 사용 금지, 타입 단언 남용 금지, strict 모드
- 쿼리키에 들어가는 params DTO는 `interface`가 아닌 `type` 별칭으로 정의
  (interface는 `Record<string, unknown>`에 할당 불가 — QUERY_KEYS 시그니처와 충돌)
- reanimated 4: `Animated.AnimateStyle` 제거됨 — `useAnimatedStyle<ViewStyle>(...)` 제네릭과 `ViewStyle` 사용

## Import

- 절대경로 `~/` 필수 (같은 슬라이스 내부만 상대경로)
- 순서는 Prettier 플러그인이 자동 정렬: react → expo → @tanstack → `~/` → 상대경로

## UI 컴포넌트 분류

- **shared/ui**: 도메인 무관 원소 컴포넌트 (Button, Input, Skeleton) — API 호출/도메인 지식 금지
  (도메인 전용 컴포넌트는 entities/{slice}/ui에 — 예: MemoSkeleton)
- **entities/ui**: 도메인 데이터 읽기 전용 표시
- **widgets**: 복합 UI — API 호출 금지, props로 데이터 수신
- 색상 등 디자인 상수는 `shared/config` (예: `STAR_COLOR`) — 컴포넌트마다 하드코딩 금지

## ESLint / Prettier

- JSX props 정렬 강제: reserved → shorthand → 일반 → callback
- singleQuote, semi, printWidth 100, trailingComma all
- 커밋 전: `pnpm typecheck && pnpm lint` (typecheck는 에러 0이 정상 상태)
