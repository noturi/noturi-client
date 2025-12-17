# Claude Development Guidelines

이 파일은 Claude AI 어시스턴트가 이 프로젝트를 이해하고 작업할 때 참고하는 가이드라인입니다.

## 기술 스택

- **프레임워크**: Expo ~54.0.13, React Native 0.81.4
- **라우팅**: Expo Router ~6.0.13
- **UI 라이브러리**: Tamagui ^1.132.15
- **상태 관리**: React Query (TanStack Query) ^5.83.0
- **언어**: TypeScript 5.9.3
- **HTTP 클라이언트**: ky ^1.8.1
- **폼 관리**: react-hook-form
- **스타일링**: Tamagui (styled components)
- **패키지 관리**: pnpm

## 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

```
project/
├── app/                          # Expo Router 전용 - 순수 라우팅만
│   ├── (tabs)/                   # 탭 네비게이션 그룹
│   ├── memo/                     # 메모 관련 라우트
│   └── _layout.tsx               # 루트 레이아웃
│
└── src/                          # 비즈니스 로직
    ├── application/              # 🚨 중요: app이 아닌 application
    │   └── providers/            # 전역 Provider들 (Tamagui, React Query, Auth)
    ├── entities/                 # 도메인 엔티티 (읽기 전용)
    │   ├── memo/
    │   ├── user/
    │   └── calendar/
    ├── features/                 # 기능별 모듈들 (CUD 작업)
    │   ├── auth/
    │   ├── memo/
    │   └── calendar/
    ├── widgets/                  # 복합 UI 컴포넌트들
    ├── pages/                    # 완전한 페이지 컴포넌트 (features/widgets 조합)
    └── shared/                   # 공통 모듈들
        ├── api/                  # 공통 API 설정
        ├── ui/                   # 공통 UI 컴포넌트
        └── lib/                  # 공통 유틸리티
```

### FSD 레이어별 역할

- **shared**: 도메인 무관한 공통 모듈 (UI 컴포넌트, 유틸리티)
- **entities**: 도메인 데이터 표현 (읽기 전용, GET 작업만)
- **features**: 비즈니스 로직과 사용자 워크플로우 (CUD 작업)
- **widgets**: 여러 기능을 조합한 독립적인 UI 블록
- **pages**: 개별 페이지의 레이아웃과 로직을 구성하며, 위젯과 기능, 엔터티를 통합함
- **app**: Expo Router 라우팅 (pages에서 컴포넌트 import)

### FSD 세그먼트 역할

- **`/api`**: 외부 서비스와의 통신 (HTTP 요청, React Query hooks)
- **`/model`**: 비즈니스 로직과 상태 관리 (타입, hooks, 순수 함수)
- **`/ui`**: 사용자 인터페이스 컴포넌트와 스타일
- **`/lib`**: (선택) 여러 모듈이 함께 사용하는 공통 library code
- **`/config`**: (선택) configuration files, feature flags

## 명령어

### 개발

```bash
pnpm start              # Expo 개발 서버 시작
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

### Import 순서

1. 외부 라이브러리
2. 내부 모듈 (~/로 시작)
3. 같은 폴더 내 파일만 상대경로

### 레이어별 Import 규칙

**하위 계층은 상위 계층을 import할 수 없음**

- `shared` < `entities` < `features` < `widgets` < `pages` < `app`
- 같은 계층 내부 import는 허용

## 코딩 스타일 및 규칙

### 레이어별 역할 분리

#### Entity Layer (READ)

- `entities/*/api/apis.ts`: GET 메서드만
- `entities/*/api/queries.ts`: useQuery hooks만

#### Feature Layer (CREATE/UPDATE/DELETE)

- `features/*/api/apis.ts`: POST, PUT, DELETE 메서드만
- `features/*/api/mutations.ts`: useMutation hooks만

#### Model vs API 분리

- `model/`: 순수 변환 함수, validation (API 호출 금지)
- `api/`: HTTP 통신과 React Query hooks

### UI 컴포넌트 분류

- **shared/ui**: 순수 원소 UI 컴포넌트 (Button, Input, Card) - API 호출 없음
- **widgets**: 복합 UI 컴포넌트 (여러 요소 조합, API 호출 가능)
  - 예: Header, Footer, Navigation (API 호출이 있는 공통 컴포넌트)
- **entities/ui**: 도메인 데이터 읽기 전용 표시

### TypeScript 규칙

- `any` 사용 금지
- 타입 단언 남용 금지
- 명시적 타이핑 사용
- `strict: true` 모드 사용

### React Query 패턴

- Query 네이밍: `memoListQuery`, `memoDetailQuery`
- Mutation 네이밍: `useCreateMemoMutation`, `useUpdateMemoMutation`
- Query Key는 `QUERY_KEYS` 상수 사용

## 용어

- **Memo**: 메모 엔티티 (기록)
- **Calendar**: 캘린더 엔티티 (일정)
- **Category**: 카테고리 엔티티 (분류)
- **Entity**: FSD의 entities 레이어 (읽기 전용)
- **Feature**: FSD의 features 레이어 (CUD 작업)
- **Widget**: FSD의 widgets 레이어 (복합 UI)

## 중요 주의사항

### ❌ 절대 사용하지 말 것

- `src/app/` → Expo Router와 충돌하여 "Unmatched Route" 에러 발생
- 상대경로 import (같은 폴더 내 제외)
- 하위 계층에서 상위 계층 import

### ✅ 올바른 네이밍

- `src/application/` → FSD의 application layer
- 절대경로 (`~/`) 사용
- 레이어 규칙 준수

## 개발 환경 설정

### Metro 설정

```javascript
// metro.config.js
config.resolver.alias = {
  '~': path.resolve(__dirname, 'src'),
};
```

### 캐시 클리어

```bash
# 기본
npx expo start --clear

# 강력한 캐시 클리어
pkill -f metro && rm -rf .expo && rm -rf node_modules/.cache && npx expo start --clear
```

---

**🚨 중요**: 이 규칙들은 실제 프로덕션 문제를 해결한 검증된 방법입니다.
