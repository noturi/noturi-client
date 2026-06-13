# FSD 아키텍처 규칙

## 레이어 의존성 (역방향 절대 금지)

```
shared < entities < features < widgets < pages < app
```

- 같은 레이어 내 다른 슬라이스는 **public API(index.ts)를 통해서만** import (딥 import 금지)
- 같은 슬라이스 내부는 상대경로 허용

## 디렉토리 구조

```
app/                          # Expo Router 전용 - 순수 라우팅만 (비즈니스 로직 금지)
src/
├── application/              # 전역 Provider, RootRouter (src/app은 Expo Router와 충돌하므로 금지)
├── entities/                 # 도메인 엔티티 — 읽기 전용 (GET + queryOptions)
│   ├── memo/                 # (api/, model/, ui/, lib/)
│   ├── todo/                 # (api/, model/, ui/, lib/)
│   ├── calendar/             # (api/, model/)
│   ├── category/             # (api/, model/, ui/)
│   ├── statistics/           # (api/, model/, ui/)
│   ├── user/                 # (api/, model/)
│   ├── auth/                 # (model/)
│   └── app-version/          # (api/, model/)
├── features/                 # CUD 작업 + useMutation
├── widgets/                  # 복합 UI 블록 (API 호출 금지, props로 데이터 수신)
├── pages/                    # 쿼리 실행 + 위젯/기능 조합 (home, memo-detail, todo, stats, ...)
└── shared/                   # 도메인 무관 공통 모듈 (api 클라이언트, ui, lib, config, model)
```

## 세그먼트 역할

| 세그먼트 | 역할 | 파일 |
| --- | --- | --- |
| `api/` | HTTP 통신 + React Query | `apis.ts`(API 클래스), `queries.ts`(Entity 전용), `mutations.ts`(Feature 전용) |
| `model/` | 타입, 스키마, 비즈니스 로직 | `types.ts`, `schemas.ts`, `constants.ts`, `*-service.ts` |
| `ui/` | 컴포넌트 | |
| `lib/` | 슬라이스 내 공통 코드 | 예: `invalidate-memo-cache.ts` |

## 파일 네이밍 (복수형 필수)

- `apis.ts` — Entity는 GET만, Feature는 POST/PUT/PATCH/DELETE만
- `queries.ts` — `queryOptions` 훅, **entities 레이어에만** 존재
- `mutations.ts` — `useMutation` 훅, **features 레이어에만** 존재

## 절대 하지 말 것

- `src/app/` 디렉토리 생성 (Expo Router 충돌 → "Unmatched Route")
- entities에 CUD API, features에 queries.ts 작성
- 상대경로 import (같은 슬라이스 내부 제외) — `~/` 절대경로 사용
- 죽은 코드 방치 — 미사용 쿼리/메서드는 만들지 말고, 발견 시 삭제

## 개선 검토 항목

- `rating-group-card.tsx`의 무한스크롤 센티넬이 300ms `setInterval` 폴링 방식
  - 스크롤 이벤트 기반(onScroll/onEndReached) 전환 권장 — 실기기 검증 필요

## 해결된 과거 위반 (2026-06) — 이 패턴으로 회귀 금지

- P0: features/categories의 GET → `entities/category/api`로 이동 완료
- P1: entities 크로스 슬라이스 딥 import → public API 경유로 수정 완료
- P2: `api.ts`/`mutation.ts` 단수형 → 복수형 통일 완료
- P3: app 라우트 비즈니스 로직 → pages 레이어 추출 완료
