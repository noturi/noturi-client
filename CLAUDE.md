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

## 🏭 모듈 구조

### Features 구조

```
features/
├── auth/
│   ├── api/                      # API 관련
│   │   ├── apis.ts              # API 클래스 (순수 데이터 조회만)
│   │   ├── mutations.ts         # React Query mutations
│   │   ├── queries.ts           # React Query queries
│   │   └── index.ts             # export 정리
│   ├── lib/                     # 비즈니스 로직 & Service Layer
│   │   ├── AuthService.ts       # 데이터 변환, 비즈니스 로직
│   │   └── index.ts             # service export
│   └── index.ts                 # feature 전체 export
```

### 📋 레이어별 역할 분리

- **API Layer** (`apis.ts`): 순수하게 서버 데이터만 조회
- **Service Layer** (`lib/`): 데이터 변환, 비즈니스 로직 처리
- **Query Layer** (`queries.ts`): API + Service 조합, 캐싱

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
