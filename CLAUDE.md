# Claude Development Guidelines

이 파일은 Claude AI 어시스턴트가 이 프로젝트를 이해하고 작업할 때 참고하는 가이드라인입니다.

## 🚨 핵심 아키텍처 규칙

### FSD (Feature-Sliced Design) 구조

```
project/
├── app/                          # Expo Router 전용 - 순수 라우팅만
│   ├── (tabs)/                   # 탭 네비게이션 그룹
│   ├── memo/                     # 메모 관련 라우트
│   ├── _layout.tsx               # 루트 레이아웃 (최소한의 코드만)
│   └── ...                       # 기타 라우트 파일들
│
└── src/                          # 비즈니스 로직
    ├── application/              # 🚨 중요: app이 아닌 application
    │   ├── providers/            # 전역 Provider들 (Tamagui, React Query, Auth)
    │   └── router/               # 라우팅 설정 (Stack.Screen 정의)
    ├── pages/                    # 페이지 컴포넌트들
    ├── features/                 # 기능별 모듈들
    ├── entities/                 # 비즈니스 엔티티들
    ├── shared/                   # 공통 모듈들
    └── widgets/                  # 복합 UI 컴포넌트들
```

### ❌ 절대 사용하지 말 것

- `src/app/` → Expo Router와 충돌하여 "Unmatched Route" 에러 발생

### ✅ 올바른 네이밍

- `src/application/` → FSD의 application layer

## 📁 디렉토리 역할

### `app/` (Expo Router 전용)

```typescript
// app/_layout.tsx - 최소한의 코드만
import { AppProvider } from '../src/application/providers';
import { RootRouter } from '../src/application/router';

export default function RootLayout() {
  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}

// app/login.tsx - pages에서 import
import LoginScreen from '../src/pages/auth/login';
export default LoginScreen;
```

### `src/application/` (전역 설정)

```typescript
// src/application/providers/AppProvider.tsx
export function AppProvider({ children }) {
  return (
    <TamaguiProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </TamaguiProvider>
  );
}

// src/application/router/RootRouter.tsx
export function RootRouter() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* 모든 Stack.Screen 정의 */}
    </Stack>
  );
}
```

## 🔗 Import 규칙

### 절대경로 사용 (~/로 시작)

```typescript
// ✅ 올바른 방법
import { useAuth } from '~/features/auth';
import { Button } from '~/shared/ui';
import { Memo } from '~/entities/memo/model/types';

// ❌ 상대경로 금지
import { useAuth } from '../../features/auth';
```

### Import 순서

```typescript
// 1. 외부 라이브러리
// 2. 내부 모듈 (~/로 시작)
import { useAuth } from '~/features/auth';
import { Button } from '~/shared/ui';

import { Text, View } from 'react-native';

import { router } from 'expo-router';

// 3. 같은 폴더 내 파일만 상대경로
import { LocalComponent } from './LocalComponent';
```

## 🏭 FSD 모듈 구조 (3-Segment Architecture)

### 🚨 FSD 핵심 원칙: 3개의 세그먼트

FSD(Feature-Sliced Design)는 각 슬라이스를 **3개의 표준 세그먼트**로 구성합니다:

- `api/` - 서버 통신
- `model/` - 비즈니스 로직, 상태, 타입
- `ui/` - UI 컴포넌트

**중요**: `lib/` 폴더는 FSD 표준이 아닙니다. 모든 로직은 `model/`에 위치해야 합니다.

### 📂 Entities vs Features: CRUD 역할 분리

**핵심 원칙**: Entities는 READ만, Features는 CREATE/UPDATE/DELETE만 담당합니다.

#### Entities (읽기 전용)

```
entities/memo/
├── api/                         # READ 전용 API
│   ├── apis.ts                 # GET 메서드만 (getMemos, getMemo, searchMemos 등)
│   ├── queries.ts              # React Query queries만
│   └── index.ts
├── model/                       # READ 관련 모든 로직 (⚠️ lib 사용 금지)
│   ├── types.ts                # 타입, 인터페이스 정의
│   ├── schemas.ts              # Zod, Yup 등 스키마
│   ├── constants.ts            # 상수, Enum
│   ├── transforms.ts           # 데이터 변환 함수 (백엔드 → UI)
│   ├── utils.ts                # 계산, 포맷팅 등 유틸리티
│   ├── hooks.ts                # READ용 커스텀 hooks
│   └── index.ts
├── ui/                          # READ용 UI 컴포넌트 (선택적)
│   └── memo-card.tsx
└── index.ts
```

**Entities의 model/ 세그먼트**:

- ✅ 타입 정의 (types.ts)
- ✅ 스키마/Validation (schemas.ts)
- ✅ 데이터 변환 함수 (백엔드 DTO → UI 모델)
- ✅ READ 관련 비즈니스 로직
- ✅ READ용 커스텀 hooks (useTransformedMemos 등)
- ✅ 계산/포맷팅 유틸리티
- ❌ API 호출 금지 (api/ 세그먼트에서만)
- ❌ CUD 로직 금지 (features로)
- ❌ lib/ 폴더 사용 금지

#### Features (쓰기 전용)

```
features/memo/
├── api/                         # CUD 전용 API
│   ├── apis.ts                 # POST, PUT, DELETE 메서드만
│   ├── mutations.ts            # React Query mutations만
│   └── index.ts
├── model/                       # CUD 관련 모든 로직 (⚠️ lib 사용 금지)
│   ├── hooks.ts                # CUD용 커스텀 hooks (useMemoForm 등)
│   ├── validation.ts           # 폼 검증 로직
│   ├── transforms.ts           # 폼 데이터 변환
│   ├── utils.ts                # 에러 핸들링, 유틸리티
│   └── index.ts
├── ui/                          # CUD용 UI 컴포넌트
│   ├── memo-form.tsx
│   ├── memo-edit-form.tsx
│   └── index.ts
└── index.ts
```

**Features의 model/ 세그먼트**:

- ✅ CUD 관련 비즈니스 로직
- ✅ 폼 validation/처리
- ✅ CUD용 커스텀 hooks (useMemoForm, useFormValidation)
- ✅ 에러 핸들링 로직
- ✅ 데이터 변환 (폼 → DTO)
- ❌ API 호출 금지 (api/ 세그먼트에서만)
- ❌ READ 로직 금지 (entities 것을 재사용)
- ❌ 타입 정의 금지 (entities에서 import)
- ❌ lib/ 폴더 사용 금지

### 🚫 절대 금지 사항

```
# ❌ 잘못된 구조
entities/memo/
├── lib/           # lib 폴더는 FSD 표준이 아님!
└── model/

# ✅ 올바른 구조
entities/memo/
├── api/
├── model/         # 모든 로직은 model에
└── ui/
```

### 📋 Model 세그먼트 역할 분리 원칙

#### API vs Model 분리

```typescript
// ❌ 잘못된 방법 - model에서 API 직접 호출
// entities/memo/model/transforms.ts
export async function fetchAndTransformMemos() {
  const memos = await memoApi.getMemos(); // ❌ model에서 API 호출 금지!
  return transformMemos(memos);
}

// ✅ 올바른 방법 - model은 순수 변환만
// entities/memo/model/transforms.ts
export function transformMemos(memos: Memo[]): UIMemo[] {
  return memos.map((memo) => ({
    /* 변환 로직 */
  }));
}

// entities/memo/api/queries.ts에서 조합
export const useTransformedMemosQuery = () => {
  const query = useQuery({
    queryKey: ['memos'],
    queryFn: () => memoApi.getMemos(),
  });

  return {
    ...query,
    data: query.data ? transformMemos(query.data) : undefined,
  };
};
```

#### Service 클래스 사용 금지

```typescript
// ❌ 잘못된 방법 - Service에서 API 직접 호출
// features/memo/model/memo-service.ts
export class MemoService {
  async createMemo(data: CreateMemoDto) {
    const validated = this.validate(data);
    return await memoApi.createMemo(validated); // ❌ Service에서 API 호출 금지!
  }
}

// ✅ 올바른 방법 - model은 validation만, api에서 조합
// features/memo/model/validation.ts
export function validateMemoData(data: CreateMemoDto): CreateMemoDto {
  if (!data.title.trim()) throw new Error('제목 필수');
  return { ...data, title: data.title.trim() };
}

// features/memo/api/mutations.ts에서 조합
export const useCreateMemoMutation = () =>
  useMutation({
    mutationFn: (data: CreateMemoDto) => {
      const validated = validateMemoData(data); // model의 validation 사용
      return memoMutationApi.createMemo(validated); // api 호출
    },
  });
```

### 📋 레이어별 역할 분리

#### Entity Layer (READ)

```typescript
// entities/memo/api/apis.ts
export class MemoApi {
  // ✅ GET 메서드만
  async getMemos(params: MemoListParamsDto): Promise<MemoListResponseDto> {}
  async getMemo(id: string): Promise<Memo> {}
  async searchMemos(query: string): Promise<MemoSearchResultDto> {}
  async getMemoStats(): Promise<MemoStatsDto> {}

  // ❌ 이런 메서드들은 features로 이동
  // async createMemo() { }
  // async updateMemo() { }
  // async deleteMemo() { }
}

// entities/memo/api/queries.ts
export const useMemoListQuery = (params: MemoListParamsDto) =>
  useQuery({
    queryKey: ['memos', 'list', params],
    queryFn: () => memoApi.getMemos(params),
  });

export const useMemoQuery = (id: string) =>
  useQuery({
    queryKey: ['memos', 'detail', id],
    queryFn: () => memoApi.getMemo(id),
  });
```

#### Feature Layer (CREATE/UPDATE/DELETE)

```typescript
// features/memo/api/apis.ts
import { CreateMemoDto, Memo, UpdateMemoDto } from '~/entities/memo';

export class MemoMutationApi {
  // ✅ CUD 메서드만
  async createMemo(data: CreateMemoDto): Promise<Memo> {}
  async updateMemo(data: UpdateMemoDto): Promise<Memo> {}
  async deleteMemo(id: string): Promise<void> {}
  async bulkDeleteMemos(ids: string[]): Promise<void> {}
}

// features/memo/api/mutations.ts
export const useCreateMemoMutation = (options?: UseMutationOptions) =>
  useMutation({
    mutationFn: memoMutationApi.createMemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] });
    },
    ...options,
  });

export const useUpdateMemoMutation = (options?: UseMutationOptions) =>
  useMutation({
    mutationFn: memoMutationApi.updateMemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memos'] });
    },
    ...options,
  });
```

### 🔄 Cross-layer 사용 패턴

```typescript
// ✅ Feature에서 Entity 사용
// features/memo/ui/memo-edit-form.tsx
import { useMemoQuery } from '~/entities/memo'; // READ는 entity에서
import { useUpdateMemoMutation } from '~/features/memo'; // WRITE는 feature에서

export function MemoEditForm({ id }: { id: string }) {
  const { data: memo } = useMemoQuery(id);          // Entity의 query
  const updateMutation = useUpdateMemoMutation();   // Feature의 mutation

  const handleSubmit = (data: UpdateMemoDto) => {
    updateMutation.mutate(data);
  };

  return <Form initialData={memo} onSubmit={handleSubmit} />;
}
```

### 📊 마이그레이션 체크리스트

기존 코드를 리팩토링할 때:

1. **Entity API 파일 검토**
   - [ ] GET 메서드만 남기기
   - [ ] POST, PUT, DELETE 메서드는 features로 이동
   - [ ] queries.ts에 useQuery만 있는지 확인

2. **Feature API 파일 검토**
   - [ ] POST, PUT, DELETE 메서드만 있는지 확인
   - [ ] GET 메서드가 있다면 entities로 이동
   - [ ] mutations.ts에 useMutation만 있는지 확인

3. **타입 정의 검토**
   - [ ] 모든 DTO, Entity 타입이 entities/\*/model/types.ts에 있는지
   - [ ] Features에서 타입을 entities에서 import하는지

4. **Import 경로 수정**
   - [ ] 읽기 작업: `~/entities/[entity-name]`에서 import
   - [ ] 쓰기 작업: `~/features/[feature-name]`에서 import

### Types 위치

```typescript
// ❌ 잘못된 방법
import { LoginDto } from '~/features/auth/api/types';

// ✅ 올바른 방법 - entities에 types 저장
import { LoginDto } from '~/entities/user/model/types';
import { CreateMemoDto } from '~/entities/memo/model/types';
import { CategoryDto } from '~/entities/category/model/types';
```

## ⚙️ Metro 설정

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 절대경로 alias 설정 필수
config.resolver.alias = {
  '~': path.resolve(__dirname, 'src'),
};

config.resolver.sourceExts.push('ts', 'tsx');
module.exports = config;
```

## 🧹 Lint 규칙

### 필수 수정 사항들

1. **Types 경로 수정**

   ```typescript
   // ❌ 에러 발생
   import { LoginDto } from './types';

   // ✅ 올바른 방법
   import { LoginDto } from '~/entities/user/model/types';
   ```

2. **Missing exports 해결**

   ```typescript
   // 모든 lib, api 폴더에 index.ts 필수
   // src/features/search/lib/index.ts
   export * from './hooks';

   // src/features/search/lib/hooks/index.ts
   export { useMemoSearch } from './useMemoSearch';
   ```

3. **React hooks dependency**

   ```typescript
   // ❌ 경고 발생
   useEffect(() => {
     // memoForm 사용
   }, [memo]); // memoForm dependency 누락

   // ✅ 올바른 방법
   useEffect(() => {
     // memoForm 사용
   }, [memo, memoForm]);
   ```

## 🚀 개발 워크플로우

### 캐시 클리어

```bash
# 기본
npx expo start --clear

# 강력한 캐시 클리어
pkill -f metro && rm -rf .expo && rm -rf node_modules/.cache && npx expo start --clear
```

### Lint

```bash
pnpm lint              # 체크
pnpm lint --fix         # 자동 수정
```

## TypeScript 규칙

### ❌ 절대 금지

```typescript
// any 사용 금지
const data: any = response;

// 타입 단언 남용 금지
const route = router.push('/login' as any);
```

### ✅ 올바른 방법

```typescript
// 명시적 타이핑
const data: LoginResponse = response;

// 타입 안전한 라우팅
const route = router.push(HREFS.login());
```

## React Query 패턴

```typescript
// Query 네이밍
export const memoListQuery = (params) => ({
  queryKey: ['memos', 'list', params],
  queryFn: () => memoApi.getList(params),
});

// Mutation 네이밍
export const useCreateMemoMutation = (options) =>
  useMutation({
    mutationFn: memoApi.create,
    ...options,
  });
```

## 에러 해결 패턴

### "Unmatched Route" 에러

1. `src/app/` → `src/application/` 이름 변경
2. Metro 캐시 클리어
3. `~/` alias 설정 확인

### Module resolution 에러

1. `metro.config.js`에 alias 설정 확인
2. Import 경로가 올바른지 확인

---

**🚨 중요**: 이 규칙들은 실제 프로덕션 문제를 해결한 검증된 방법입니다.

**최근 해결된 주요 이슈들**:

- ✅ "Unmatched Route" → `src/app/` → `src/application/` 해결
- ✅ Module resolution → 절대경로(`~/`) 통일
- ✅ Lint 에러들 → Types 경로 정리, missing exports
- ✅ FSD 구조 완성 → 비즈니스 로직과 라우팅 분리
