# 코드 스타일

## TypeScript

- `any` 사용 금지, 타입 단언 남용 금지, strict 모드
- 쿼리키에 들어가는 params DTO는 `interface`가 아닌 `type` 별칭으로 정의
  (interface는 `Record<string, unknown>`에 할당 불가 — QUERY_KEYS 시그니처와 충돌)
- catch 절은 `unknown` — `getErrorCode`/`getErrorMessage`(`~/shared/lib`)로 값 추출
- API 응답은 `parseResponse(schema, data, label)`(`~/shared/api`)로 검증 — 스키마는 `z.ZodType<T>`로 타입과 고정
- 로그는 `console.*` 대신 `Logger`(`~/shared/lib/logger`) — 운영 빌드는 ERROR만 출력
- reanimated 4: `Animated.AnimateStyle` 제거됨 — `useAnimatedStyle<ViewStyle>(...)` 제네릭과 `ViewStyle` 사용

## React 19 / React Compiler

- **React Compiler 활성화됨** (`app.json` `experiments.reactCompiler`) — `useCallback`/`useMemo`/`memo`를 새로 쓰지 않는다
  - 예외: 컴파일러가 건너뛰는 컴포넌트(`try/finally`, 동적 `import()` 등 미지원 문법 포함)에서 참조 안정성이 실제로 필요할 때만
- Rules of React 준수 — 렌더 중 `ref.current` 읽기/쓰기 금지, 렌더 중 shared value 읽기 금지
- 훅이 반환하는 객체에 ref를 섞지 말고 따로 꺼내 쓴다 (컴파일러가 객체 전체를 ref로 취급)
- props/서버 데이터로 상태를 맞출 때 effect 대신 렌더 중 상태 조정 패턴 (`useMemoForm` 참고)
- `forwardRef` 대신 `ref`를 일반 prop으로, `useContext` 대신 `use`, `<Ctx.Provider>` 대신 `<Ctx>`
- Reanimated shared value는 `.get()`/`.set()` (`.value` 대입은 컴파일러가 최적화를 건너뜀)

## React Native

- 터치는 `Pressable` (`Touchable*` 사용 금지)
- 화면 크기는 `useWindowDimensions()` — 모듈 레벨 `Dimensions.get()` 금지 (회전/분할화면 미반영)
- 길어질 수 있는 목록은 `FlashList`(v2, New Arch 전용) — 홈 메모 목록(`widgets/memo-rating-list`) 참고
  - 그룹/카드 구조는 순수 함수로 행 배열로 평탄화(+ 테스트), `getItemType`/`keyExtractor` 필수
  - 페이지네이션은 `onViewableItemsChanged`/`onEndReached` — 센티넬 `measureLayout` 금지
  - 행 추가/제거 애니메이션은 `prepareForLayoutAnimationRender()` + `LayoutAnimation.configureNext()`
    (재활용 셀에서 reanimated `entering`/`exiting`, 높이 clip 애니메이션 금지)

## Import

- 절대경로 `~/` 필수 (같은 슬라이스 내부만 상대경로)
- 순서는 Prettier 플러그인이 자동 정렬: react → expo → @tanstack → `~/` → 상대경로

## UI 컴포넌트 분류

- **shared/ui**: 도메인 무관 원소 컴포넌트 (Button, Input, Skeleton) — API 호출/도메인 지식 금지
  (도메인 전용 컴포넌트는 entities/{slice}/ui에 — 예: MemoSkeleton)
- **entities/ui**: 도메인 데이터 읽기 전용 표시
- **widgets**: 복합 UI — API 호출 금지, props로 데이터 수신
- **표시 컴포넌트는 부수효과를 숨기지 않는다**: entities/ui·features의 버튼은 `router`를 직접 호출하지 않고
  `onPress`/`onDeleted` 같은 콜백으로 노출 — 이동 여부는 pages가 결정
- **다른 feature의 UI가 필요하면 슬롯(render prop)으로 주입** — 예: `MemoForm`의 `renderAddCategory`
- **같은 기능의 UI는 하나만** — 카테고리 생성은 `CategoryInlineAddForm`만 사용
- **바텀시트는 `ControlledSheet`(`~/shared/ui`)만 사용** — `BottomSheetModal` 직접 사용·present/dismiss effect 복붙 금지.
  룩은 `background`(`'secondary'|'surface'`), 제목은 `title`, 고정 버튼은 `overlay` 슬롯으로 (새 룩은 `SHEET_BACKGROUNDS`에 추가)
- 컴포넌트에 폼 상태·검증·저장 로직이 커지면 `model/use-*.ts` 훅으로 분리 (예: `useMemoForm`)
- 정적 메서드만 있는 `*Service` 클래스 대신 순수 함수 (`lib/`) — 읽기 변환은 entities/{slice}/lib
- 외부 라이브러리는 shared 파사드 경유: 토스트 `useToast`, 아이콘 `~/shared/lib/icons`
- 색상 등 디자인 상수는 `shared/config` (예: `STAR_COLOR`) — 컴포넌트마다 하드코딩 금지

## ESLint / Prettier

- JSX props 정렬 강제: reserved → shorthand → 일반 → callback
- singleQuote, semi, printWidth 100, trailingComma all
- 바텀시트 backdrop은 `SheetBackdrop`(`~/shared/ui`)을 `backdropComponent`에 전달
- 커밋 전: `pnpm typecheck && pnpm lint && pnpm test:ci`

## 테스트

- Jest(`jest-expo`), 대상 파일 옆에 `*.test.ts`로 배치
- 순수 로직(lib, model, service) 우선 — 변경 시 테스트 함께 수정
