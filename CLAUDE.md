# Claude Development Guidelines

이 파일은 Claude AI 어시스턴트가 이 프로젝트를 이해하고 작업할 때 참고하는 가이드라인입니다.

## 기술 스택

- **프레임워크**: Expo ~54.0.33, React Native 0.81.5, React 19.1.0
- **라우팅**: Expo Router ~6.0.23 (타입 라우트 활성화)
- **스타일링**: NativeWind ^4.2.1 (Tailwind CSS 기반), global.css
- **상태 관리**: React Query (TanStack Query) ^5.83.0
- **언어**: TypeScript ~5.9.3 (strict mode)
- **HTTP 클라이언트**: ky ^1.8.1
- **스키마 검증**: zod ^4.0.5
- **날짜 유틸**: date-fns ^4.1.0
- **애니메이션**: react-native-reanimated ~4.1.3
- **아이콘**: lucide-react-native ^0.562.0
- **바텀시트**: @gorhom/bottom-sheet ^5.2.8
- **리스트 성능**: recyclerlistview ^4.2.3
- **인증**: Google Sign-In, Apple Authentication, expo-auth-session
- **알림**: expo-notifications
- **토스트**: sonner-native ^0.21.2
- **패키지 관리**: pnpm

## 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

```
project/
├── app/                          # Expo Router 전용 - 순수 라우팅만
│   ├── _layout.tsx               # 루트 레이아웃 (AppProvider 래핑)
│   ├── (tabs)/                   # 탭 네비게이션 그룹
│   │   ├── index.tsx             # 홈 (메모 목록)
│   │   ├── todo.tsx              # 투두
│   │   ├── stats.tsx             # 통계
│   │   └── settings.tsx          # 설정
│   ├── memo/                     # 메모 관련 라우트
│   │   ├── [id].tsx              # 메모 상세
│   │   ├── create/index.tsx      # 메모 생성
│   │   └── edit/[id].tsx         # 메모 수정
│   ├── todo/create.tsx           # 투두 생성
│   ├── search.tsx                # 검색
│   ├── login.tsx                 # 로그인
│   └── agreement.tsx             # 약관 동의
│
└── src/                          # 비즈니스 로직
    ├── application/              # app이 아닌 application (Expo Router 충돌 방지)
    │   ├── providers/            # 전역 Provider들 (Query, Auth, Theme, Notification)
    │   └── router/               # RootRouter, TabsRouter
    ├── entities/                 # 도메인 엔티티 (읽기 전용)
    │   ├── memo/                 # (api/, model/, ui/, lib/)
    │   ├── todo/                 # (api/, model/, ui/, lib/)
    │   ├── calendar/             # (api/, model/)
    │   ├── category/             # (model/, ui/) - api 없음 (알려진 이슈)
    │   ├── statistics/           # (api/, model/, ui/)
    │   ├── user/                 # (api/, model/)
    │   ├── auth/                 # (model/ 만)
    │   └── app-version/          # (api/, model/)
    ├── features/                 # 기능별 모듈들 (CUD 작업)
    │   ├── auth/                 # (api/, ui/, model/)
    │   ├── memo/                 # (api/, ui/, model/)
    │   ├── todo/                 # (api/, ui/)
    │   ├── calendar/             # (api/, ui/, model/)
    │   ├── categories/           # (api/, ui/, model/)
    │   ├── search/               # (model/, ui/)
    │   ├── statistics/           # (api/, model/)
    │   ├── notification/         # (api/, ui/, model/)
    │   └── user/                 # (api/, ui/)
    ├── widgets/                  # 복합 UI 컴포넌트들
    │   ├── todo-weekly-view/
    │   ├── calendar-memo-list/
    │   ├── memo-list-with-year-filter/
    │   └── calendar-view/
    ├── pages/                    # 완전한 페이지 컴포넌트 (features/widgets 조합)
    │   ├── home/
    │   ├── todo/
    │   ├── settings/
    │   ├── login/
    │   ├── agreement/
    │   └── stats/
    └── shared/                   # 공통 모듈들
        ├── api/                  # API 클라이언트, interceptors, auth 헬퍼
        ├── ui/                   # 공통 UI 컴포넌트 (Button, Input, Card 등)
        ├── lib/                  # 유틸리티, hooks, 상수, QUERY_KEYS
        ├── config/               # 설정값
        └── model/                # 토큰 이벤트 관리자, 메시지
```

### FSD 레이어별 역할

- **shared**: 도메인 무관한 공통 모듈 (UI 컴포넌트, 유틸리티)
- **entities**: 도메인 데이터 표현 (읽기 전용, GET 작업만)
- **features**: 비즈니스 로직과 사용자 워크플로우 (CUD 작업)
- **widgets**: 여러 기능을 조합한 독립적인 UI 블록 (API 호출 가능)
- **pages**: 개별 페이지의 레이아웃과 로직을 구성하며, 위젯과 기능, 엔터티를 통합함
- **app**: Expo Router 라우팅 (pages에서 컴포넌트 import, 비즈니스 로직 금지)

### FSD 세그먼트 역할

- **`/api`**: 외부 서비스와의 통신 (HTTP 요청, React Query hooks)
  - `apis.ts`: HTTP 메서드 (Entity는 GET만, Feature는 POST/PUT/DELETE/PATCH만)
  - `queries.ts`: `queryOptions` 훅 (Entity 전용)
  - `mutations.ts`: `useMutation` 훅 (Feature 전용)
- **`/model`**: 비즈니스 로직과 상태 관리 (타입, hooks, 순수 함수)
  - `types.ts`: 타입 정의
  - `schemas.ts`: zod 스키마 (선택)
  - `constants.ts`: 상수 (선택)
  - `*-service.ts`: 비즈니스 로직 클래스 (Feature 전용)
  - `hooks/`: 커스텀 훅 (선택)
- **`/ui`**: 사용자 인터페이스 컴포넌트와 스타일
- **`/lib`**: (선택) 여러 모듈이 함께 사용하는 공통 library code
- **`/config`**: (선택) configuration files, feature flags

## 명령어

### 개발

```bash
pnpm start              # Expo 개발 서버 시작
pnpm start:expo-go      # Expo Go용 개발 서버
pnpm android            # Android 앱 실행
pnpm ios                # iOS 앱 실행
pnpm web                # 웹 앱 실행
```

### 코드 품질

```bash
pnpm lint               # ESLint 체크
pnpm lint:fix           # ESLint 자동 수정
pnpm format             # Prettier 포맷팅
pnpm format:check       # Prettier 체크
```

### 테스트

```bash
pnpm test               # Jest 테스트 실행
```

### 기타

```bash
pnpm assets:generate    # 앱 아이콘 및 에셋 생성
```

### 캐시 클리어

```bash
npx expo start --clear

# 강력한 캐시 클리어
pkill -f metro && rm -rf .expo && rm -rf node_modules/.cache && npx expo start --clear
```

## Import 규칙

### 절대경로 사용 (~/로 시작)

```typescript
// ✅ 올바른 방법
import { useAuth } from '~/features/auth';
import { Button } from '~/shared/ui';
import { Memo } from '~/entities/memo/model/types';

// ❌ 상대경로 금지 (같은 폴더 내 제외)
import { useAuth } from '../../features/auth';
```

### Import 순서 (Prettier 자동 정렬)

Prettier 플러그인(`@trivago/prettier-plugin-sort-imports`)이 자동 정렬합니다:

1. `react` 관련
2. `expo` 관련
3. `@tamagui` 관련
4. `@tanstack` 관련
5. 절대경로 (`@/`, `~/`)
6. 상대경로 (`./`, `../`)

### 레이어별 Import 규칙

**하위 계층은 상위 계층을 import할 수 없음**

```
shared < entities < features < widgets < pages < app
```

- 같은 계층 내 다른 슬라이스는 public API(index.ts)를 통해서만 import
- 같은 슬라이스 내부는 상대경로 허용

## 코딩 스타일 및 규칙

### 파일 네이밍 규칙

```
entities/*/api/apis.ts       # API 클래스 (복수형)
entities/*/api/queries.ts    # queryOptions (복수형)
features/*/api/apis.ts       # API 클래스 (복수형)
features/*/api/mutations.ts  # useMutation hooks (복수형)
```

### 레이어별 역할 분리

#### Entity Layer (READ)

- `entities/*/api/apis.ts`: GET 메서드만
- `entities/*/api/queries.ts`: `queryOptions` 훅만

```typescript
// entities/memo/api/queries.ts
export const memoListQuery = (params: MemoListParamsDto = {}) =>
  queryOptions({
    queryKey: [QUERY_KEYS.memos[0], params],
    queryFn: () => memoApi.getMemos(params),
  });
```

#### Feature Layer (CREATE/UPDATE/DELETE)

- `features/*/api/apis.ts`: POST, PUT, DELETE, PATCH 메서드만
- `features/*/api/mutations.ts`: `useMutation` hooks만

```typescript
// features/memo/api/mutations.ts
export function useCreateMemoMutation(options = {}) {
  return useMutation({
    mutationKey: ['memo', 'create'],
    mutationFn: (data: CreateMemoDto) => memoMutationApi.createMemo(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memos });
    },
  });
}
```

#### Model vs API 분리

- `model/`: 순수 변환 함수, validation, 타입 (API 호출 금지)
- `api/`: HTTP 통신과 React Query hooks

### UI 컴포넌트 분류

- **shared/ui**: 순수 원소 UI 컴포넌트 (Button, Input, Card) - API 호출 없음
- **widgets**: 복합 UI 컴포넌트 (여러 요소 조합, API 호출 가능)
- **entities/ui**: 도메인 데이터 읽기 전용 표시

### TypeScript 규칙

- `any` 사용 금지
- 타입 단언 남용 금지
- 명시적 타이핑 사용
- `strict: true` 모드 사용

### React Query 패턴

- Query 네이밍: `memoListQuery`, `memoDetailQuery` (queryOptions 반환)
- Mutation 네이밍: `useCreateMemoMutation`, `useUpdateMemoMutation` (useMutation 반환)
- Query Key는 `QUERY_KEYS` 상수 사용 (`~/shared/lib`)
- 무한 스크롤: `infiniteMemoListQuery` (infiniteQueryOptions)

### ESLint 규칙

- JSX Props 정렬 강제 (`react/jsx-sort-props`)
  - callbacksLast: 콜백 함수를 마지막에
  - shorthandFirst: 축약 문법을 먼저
  - reservedFirst: 예약어를 먼저 (key, ref 등)

### Prettier 규칙

- singleQuote: true (단일 따옴표)
- semi: true (세미콜론 필수)
- printWidth: 100 (줄 길이)
- tabWidth: 2 (들여쓰기)
- trailingComma: all (후행 쉼표)
- arrowParens: always

## 알려진 FSD 위반 사항

현재 코드베이스에 존재하는 위반 사항들입니다. 새 코드 작성 시 이 패턴을 따르지 마세요.

### P0: 아키텍처 위반

1. **features/categories에 queries.ts 존재** - GET 쿼리는 entities 레이어에만 있어야 함
   - `features/categories/api/queries.ts` → `entities/category/api/queries.ts`로 이동 필요
   - `features/categories/api/apis.ts`에 GET 메서드 7개 포함 → entities로 이동 필요
   - `entities/category/`에 api 세그먼트가 없음 → 생성 필요

### P1: Entities 내 크로스 슬라이스 Import

2. **entities/auth → entities/user** 직접 import
3. **entities/memo → entities/category** 직접 import (ui 컴포넌트, 타입)

### P2: 파일 네이밍 불일치

4. 일부 파일이 `api.ts`(단수), `statistics-api.ts`(접두사) 등 비일관적
   - 표준: `apis.ts` (복수형), `mutations.ts` (복수형)
   - 위반: `features/auth/api/mutation.ts` (단수형)
   - 위반: `entities/calendar/api/api.ts` (단수형)

### P3: app 라우트에 비즈니스 로직

5. `app/memo/[id].tsx` 등 일부 라우트 파일에 useQuery, 날짜 포맷팅 등 로직 포함
   - pages 레이어로 추출 필요

## 용어

- **Memo**: 메모 엔티티 (기록)
- **Todo**: 할 일 엔티티 (작업 목록)
- **Calendar**: 캘린더 엔티티 (일정)
- **Category**: 카테고리 엔티티 (분류)
- **Statistics**: 통계 엔티티 (데이터 분석)
- **Entity**: FSD의 entities 레이어 (읽기 전용)
- **Feature**: FSD의 features 레이어 (CUD 작업)
- **Widget**: FSD의 widgets 레이어 (복합 UI)

## 중요 주의사항

### ❌ 절대 하지 말 것

- `src/app/` 디렉토리 생성 → Expo Router와 충돌하여 "Unmatched Route" 에러 발생
- 상대경로 import (같은 폴더 내 제외)
- 하위 계층에서 상위 계층 import
- entities 레이어에 CUD API 작성
- features 레이어에 queries.ts 작성 (새로 만들지 말 것)
- `any` 타입 사용

### ✅ 반드시 따를 것

- `src/application/` → FSD의 application layer (app 아님)
- 절대경로 (`~/`) 사용
- 레이어 규칙 준수
- 새 슬라이스 생성 시 index.ts barrel export 포함
- API 파일명은 `apis.ts`, mutation 파일명은 `mutations.ts` (복수형)
- JSX props 순서: reserved → shorthand → 일반 → callback

---

**이 규칙들은 실제 프로덕션 문제를 해결한 검증된 방법입니다.**
