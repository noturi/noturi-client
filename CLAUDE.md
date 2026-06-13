# Noturi Client

메모/투두/캘린더 관리 앱 (Expo / React Native). 별도 레포인 noturi-server(NestJS API), noturi-admin(Next.js 어드민)과 함께 동작한다.

## 기술 스택

- **Expo ~54** + React Native 0.81 + React 19, **Expo Router ~6** (타입 라우트)
- **NativeWind 4** (Tailwind 기반) + global.css
- **TanStack React Query 5** (서버 상태) + **ky** (HTTP) + **zod 4**
- TypeScript strict, date-fns, reanimated 4, @gorhom/bottom-sheet, lucide-react-native
- 인증: Google Sign-In, Apple Authentication / 알림: expo-notifications
- **pnpm** 패키지 매니저

## 명령어

```bash
pnpm start              # Expo 개발 서버
pnpm ios / android      # 네이티브 실행
pnpm typecheck          # tsc --noEmit (에러 0이 정상 상태)
pnpm lint / lint:fix    # ESLint
pnpm format             # Prettier
npx expo start --clear  # 캐시 클리어
```

## 아키텍처: FSD (Feature-Sliced Design)

의존성: `shared < entities < features < widgets < pages < app` (역방향 금지)

| 레이어 | 역할 |
| --- | --- |
| `app/` (루트) | Expo Router 라우팅만 — pages에서 컴포넌트 import |
| `src/pages/` | 쿼리 실행 + 위젯/기능 조합 |
| `src/widgets/` | 복합 UI (API 호출 금지, props 수신) |
| `src/features/` | CUD + `useMutation` |
| `src/entities/` | 읽기 전용 (GET + `queryOptions`) |
| `src/shared/` | 공통 모듈 (api, ui, lib, config, model) |
| `src/application/` | 전역 Provider, 라우터 (`src/app/`은 Expo Router 충돌로 금지) |

## 상세 규칙

- @.claude/rules/fsd-architecture.md — 구조, 세그먼트, 네이밍, 금지 사항
- @.claude/rules/react-query-patterns.md — 쿼리/뮤테이션/캐시 무효화 패턴
- @.claude/rules/code-style.md — TS/Import/UI 분류/린트

## 용어

- **Memo**: 메모(기록) / **Todo**: 할 일 / **Calendar**: 일정 / **Category**: 분류 / **Statistics**: 통계
