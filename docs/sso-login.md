# Activity SSO 로그인 연동 가이드

이 문서는 `#126`에서 `@umc-product/auth-client`로 SSO 로그인을 붙인 내용과, 로컬·dev에서 검증할 때 필요한 준비를 정리합니다.  
공통 패키지 개념은 Operations의 [SSO 연동 가이드](https://github.com/UMC-PRODUCT/umc-product-web-operations/blob/develop/docs/sso-integration-guide.md)를 참고하고, **이 문서는 Activity 앱 기준**입니다.

---

## 1. 무엇이 바뀌었나

### 이전 (QA 임시 로그인)

- `/login`에서 이메일·비밀번호를 받아 `POST /api/v1/auth/login/email`을 **앱이 직접** 호출
- access/refresh를 `localStorage` (`auth:accessToken` 등)에 저장
- 로그아웃은 로컬 토큰만 삭제

### 이후 (SSO)

| 구분      | 내용                                                                    |
| --------- | ----------------------------------------------------------------------- |
| 패키지    | `@umc-product/auth-client@0.1.1`                                        |
| 로그인    | 인증 앱(`auth-app`) 또는 로컬 `direct` + QA 폼 → `devLogin`             |
| 콜백      | `/auth/callback`에서 인가 코드 → 토큰 교환                              |
| 토큰      | access는 패키지 **메모리**, refresh는 패키지 localStorage (`umc.sso.*`) |
| API       | Axios Bearer + 401 시 `recoverFromUnauthorized`                         |
| 세션/권한 | 기존과 동일 — `GET /api/v2/member/me` → Zustand (`entities/session`)    |
| 로그아웃  | `logout({ global: true })` — 서버 refresh 폐기 + SSO 쿠키 종료          |
| UX        | `/login`·`/auth/callback`에서는 Header를 숨기고 스피너만 표시           |

### 건드리지 않은 것

- `entities/session` (역할·access matrix·`toSession`)
- 데모데이·가이드 등 feature 라우트/비즈니스 로직
- 도메인 API의 `VITE_API_URL` 사용 방식 (SSO 패키지 내부 호출만 stage `apiBaseUrl` 사용)

---

## 2. 로그인 기능이 어떻게 동작하나

### 설정 (origin → stage · clientId)

`src/shared/auth/resolve-sso-env.ts`:

| Origin                                           | Stage | clientId   |
| ------------------------------------------------ | ----- | ---------- |
| `http://localhost:5173`                          | local | `local`    |
| `https://dev.activity.university.neordinary.com` | dev   | `activity` |
| `https://activity.university.neordinary.com`     | prod  | `activity` |

- 로컬만 `VITE_AUTH_APP_URL`, `VITE_SSO_LOGIN_MODE`로 오버라이드 가능
- 배포(dev/prod)는 항상 `auth-app` 모드

> `clientId`는 인증 서버에 **등록된 문자열과 완전히 같아야** 합니다. 표는 `src/shared/auth/resolve-sso-env.ts`의 `CLIENT_ID`입니다.

### 흐름 요약

```text
[보호 라우트] 토큰 없음
    → /login?redirect=...

[auth-app 모드]
    → startLogin(returnTo)
    → 인증 앱 /authorize
    → 로그인 후 /auth/callback?code&state
    → handleCallback → 토큰 저장 → returnTo

[direct 모드 · 로컬]
    → SSO 쿠키 있으면 startLogin
    → 없으면 QA LoginForm → devLogin → authorize → 콜백 (동일)

[이후 API]
    → Authorization: Bearer <access>
    → 401이면 renew 1회 재시도

[루트 beforeLoad]
    → GET /api/v2/member/me → sessionStore (기존과 동일)
```

### 주요 파일

| 경로                                       | 역할                                              |
| ------------------------------------------ | ------------------------------------------------- |
| `src/shared/auth/sso-client.ts`            | `createAuthClient` 싱글톤                         |
| `src/shared/auth/resolve-sso-env.ts`       | Activity origin·clientId 표                       |
| `src/routes/login.tsx`                     | auth-app / direct 분기                            |
| `src/routes/auth/callback.tsx`             | `handleCallback`                                  |
| `src/features/auth/ui/LoginForm.tsx`       | QA Chip 폼 (direct 전용)                          |
| `src/features/auth/hooks/useEmailLogin.ts` | `devLogin` 호출                                   |
| `src/shared/api/authToken.ts`              | `getAccessToken` / `clearAuthTokens` → SSO 브리지 |
| `src/shared/api/client.ts`                 | Bearer + 401 recover                              |
| `src/widgets/header/Header.tsx`            | 글로벌 로그아웃                                   |
| `src/routes/__root.tsx`                    | 공개 경로 가드 + Header 숨김                      |
| `src/shared/ui/AuthBusyScreen.tsx`         | 로그인/콜백 대기 스피너                           |

### 로그인 모드

| `VITE_SSO_LOGIN_MODE`      | 동작                                                  |
| -------------------------- | ----------------------------------------------------- |
| 미설정 / `auth-app` (기본) | `/login` 진입 즉시 인증 앱으로 이동                   |
| `direct` (로컬만)          | QA 이메일 폼 → `devLogin` (인증 앱 UI 없이 개발 가능) |

배포 stage에서는 env로 `direct`를 넣어도 패키지가 `auth-app`으로 고정합니다.

### 로그아웃

헤더 로그아웃:

1. `logout({ global: true, returnTo: <origin>/login })`
2. refresh 서버 폐기 → (auth-app이면) 인증 앱 `/logout` → Activity `/login`
3. `/login`이 다시 `startLogin`을 호출해 인증 앱 로그인으로 이어질 수 있음 (Operations와 동일 패턴)
4. `/login`·콜백에서는 Header를 숨겨 앱 셸이 깜빡이지 않게 함

---

## 3. 로컬에서 테스트하려면

### 공통 준비

1. Node 22 + `npm ci`
2. GitHub Packages `read:packages` 토큰 (`~/.npmrc`)
3. `.env` 작성 (아래 예시)
4. Activity: `http://localhost:5173` (포트 고정 권장 — origin 표와 일치해야 함)

### `.env` 예시

**A. auth-app (인증 앱과 함께 — 배포와 가장 유사)**

```bash
VITE_API_URL=https://api-dev.university.neordinary.com
# VITE_SSO_LOGIN_MODE 생략 → 기본 값은 auth-app 으로 되어있음
# VITE_AUTH_APP_URL=http://localhost:5174
```

추가로 필요:

- 인증 앱(`umc-product-web-auth`)을 **5174**에서 실행
- 인증 서버에 client `local` + redirect `http://localhost:5173/auth/callback` 등록
- 인증 앱 `return_to` allowlist에 `http://localhost:5173` 포함
- Vite가 SSO용 상대경로 `/api`를 프록시함 (기본 대상 api-dev). 바꾸려면 `VITE_DEV_API_PROXY_TARGET`

**B. direct (인증 앱 없이 QA 폼)**

```bash
VITE_API_URL=https://api-dev.university.neordinary.com
VITE_SSO_LOGIN_MODE=direct
VITE_QA_ACCOUNTS=최고 관리자=someone@example.com,지부장=other@example.com
```

- Chip은 이메일만 채움 — **비밀번호는 직접 입력**
- `devLogin`이 이메일 로그인 후 authorize를 이어 가므로 API·SSO 엔드포인트가 프록시로 닿아야 함

### 로컬 체크리스트

- [ ] 비로그인으로 `/demo-day/...` 접근 → `/login`으로 이동
- [ ] `auth-app`: 인증 앱으로 넘어간 뒤 콜백 → 홈(또는 redirect) 복귀
- [ ] `direct`: QA 폼 로그인 → 콜백 → 세션·권한 화면 정상
- [ ] API 요청에 Bearer가 붙는지 (네트워크 탭)
- [ ] 헤더 로그아웃아웃 후 SSO 세션이 끊기는지
- [ ] `/login`·콜백에서 Header가 안 보이는지

### 단위 테스트

```bash
npm run test -- --run src/shared/auth/resolve-sso-env.test.ts
```

---

## 4. Dev 환경에서 테스트하려면

대상: `https://dev.activity.university.neordinary.com`

이 환경은 **항상 `auth-app`** 입니다. `VITE_SSO_LOGIN_MODE=direct`는 의미가 없습니다.

### 선행 조건 (앱 코드 밖)

인증/인프라 쪽에 아래가 되어 있어야 합니다. 하나라도 없으면 로그인·콜백에서 실패합니다.

| 항목                          | 기대 값                                                        |
| ----------------------------- | -------------------------------------------------------------- |
| SSO `clientId`                | `activity` (서버 `app.sso.clients` 등록값과 일치해야 함)       |
| Redirect URI                  | `https://dev.activity.university.neordinary.com/auth/callback` |
| Auth 앱 `return_to` allowlist | `https://dev.activity.university.neordinary.com`               |
| API                           | 패키지 stage 기준 `https://api-dev.university.neordinary.com`  |
| Auth 앱                       | `https://dev.auth.university.neordinary.com`                   |

Amplify 등에 넣는 앱 env는 보통:

```bash
VITE_API_URL=https://api-dev.university.neordinary.com
# SSO 모드/인증 앱 URL은 origin 표로 결정되므로 배포에 넣지 않아도 됨
```

### Dev 체크리스트

- [ ] 시크릿/일반 창에서 사이트 진입 → 로그인으로 유도
- [ ] 인증 앱(dev.auth)에서 로그인 후 Activity로 복귀
- [ ] 콜백 URL이 `/auth/callback`인지, 성공 후 서비스 화면이 열리는지
- [ ] 역할별 계정으로 access(메뉴·설정 화면)가 기존과 같은지
- [ ] 로그아웃 → 인증 앱 세션까지 종료되는지
- [ ] 다른 UMC 웹(Operations 등)과 SSO 공유/종료 동작이 의도대로인지
- [ ] `clientId` 불일치 시: authorize 거부 / 토큰 교환 실패 — 서버 등록 문자열 재확인

### 자주 막히는 지점

1. **clientId 불일치** — 프론트 표(`activity`)와 서버 등록 문자열이 다르면 실패
2. **callback 미등록** — redirect_uri mismatch
3. **return_to 미허용** — 로그아웃 후 Activity로 못 돌아옴
4. **잘못된 origin** — 표에 없는 호스트면 `UnregisteredOriginError`

---

## 5. 환경 변수 정리

| 변수                        | 필수        | 설명                                          |
| --------------------------- | ----------- | --------------------------------------------- |
| `VITE_API_URL`              | 권장        | 도메인 API Axios baseURL                      |
| `VITE_AUTH_APP_URL`         | 로컬 선택   | 기본 `http://localhost:5174`                  |
| `VITE_SSO_LOGIN_MODE`       | 로컬 선택   | `auth-app` \| `direct`                        |
| `VITE_DEV_API_PROXY_TARGET` | 로컬 선택   | `/api` 프록시 대상 (기본 api-dev)             |
| `VITE_QA_ACCOUNTS`          | direct 선택 | Chip용 `라벨=이메일` CSV (비밀번호 넣지 않음) |
| `VITE_GA_MEASUREMENT_ID`    | 선택        | GA4 (로그인과 무관)                           |

---

## 6. 참고

- 패키지: [`@umc-product/auth-client`](https://github.com/UMC-PRODUCT/umc-product-auth-client)
- 참고 구현: `umc-product-web-operations`의 `src/shared/auth`, `src/routes/login.tsx`, `src/routes/auth/callback.tsx`
- 이슈: `#126`
