import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LinkProvider } from '@umc-product/react';

import { MOCK_CHAPTERS } from '@/entities/chapter';
import {
  matchingAffiliationQueryOptions,
  myInfoQueryOptions,
  type ServerSession,
  type Session,
  toSession,
  useSessionStore,
} from '@/entities/session';
import { clearAuthTokens, getAccessToken } from '@/shared/api/authToken';
import { ApiError } from '@/shared/api/client';
import { toId } from '@/shared/api/toId';
import { RouterLink } from '@/shared/ui/RouterLink';
import { Header } from '@/widgets/header';
import { ToastProvider } from '@/widgets/toast';

const PUBLIC_PATHS = ['/login', '/auth/callback'];

const isSameSession = (left: Session, right: Session) =>
  left.role === right.role &&
  left.challengerType === right.challengerType &&
  left.chapterId === right.chapterId &&
  left.serverChapterId === right.serverChapterId &&
  left.memberId === right.memberId &&
  left.gisuId === right.gisuId;

const toMatchingChapterSession = async (
  queryClient: QueryClient,
  session: ServerSession,
): Promise<ServerSession> => {
  if (session.gisuId === null) return session;
  const affiliation = await queryClient
    .ensureQueryData(matchingAffiliationQueryOptions(session.gisuId))
    .catch(() => null);
  const matchingChapterId = toId(affiliation?.matchingChapter?.id);
  if (!affiliation?.transferred || matchingChapterId === null) return session;
  return {
    ...session,
    serverChapterId: matchingChapterId,
    chapterName: affiliation.matchingChapter?.name ?? null,
  };
};

const RootComponent = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // 로그인 · 콜백은 Operations처럼 앱 셸(Header) 없이 대기 화면만 보여 깜빡임을 줄인다
  const hideChrome = PUBLIC_PATHS.includes(pathname);

  return (
    <LinkProvider component={RouterLink}>
      <ToastProvider>
        {/* TODO: 푸터 잠시 숨김. 다시 넣을 때 <Footer />(@/widgets/footer)를 내용 영역 아래에 추가 */}
        <div className="flex min-h-dvh flex-col">
          {!hideChrome && <Header />}
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </div>
      </ToastProvider>
      <TanStackRouterDevtools />
    </LinkProvider>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // 하위 라우트의 권한 확인(beforeLoad)보다 먼저 실행돼서, 화면을 그리기 전에 내 정보로 세션을 채움
  beforeLoad: async ({ context, location }) => {
    // 로그인 · 콜백은 토큰 없이 들어와야 함
    if (PUBLIC_PATHS.includes(location.pathname)) return;

    const loginRedirect = location.href;
    const toLogin = () =>
      redirect({
        to: '/login',
        search:
          loginRedirect.startsWith('/') && !loginRedirect.startsWith('//')
            ? { redirect: loginRedirect }
            : {},
      });

    if (!getAccessToken()) throw toLogin();

    const myInfo = await context.queryClient
      .ensureQueryData(myInfoQueryOptions)
      .catch((error: unknown) => {
        // 토큰이 만료 · 무효면 다시 로그인
        if (error instanceof ApiError && error.status === 401) {
          clearAuthTokens();
          throw toLogin();
        }
        throw error;
      });
    const { chapterName, ...serverSession } = await toMatchingChapterSession(
      context.queryClient,
      toSession(myInfo),
    );
    const session: Session = {
      ...serverSession,
      // TODO: mock 지부를 쓰는 화면이 서버 지부로 바뀌면 제거. 지금은 이름으로 mock 지부를 찾음
      chapterId: MOCK_CHAPTERS.find(({ name }) => name === chapterName)?.id ?? null,
    };

    // 이동할 때마다 실행되므로, 바뀌었을 때만 넣어야 뷰 선택(setSession이 초기화)이 유지됨
    const { session: current, setSession } = useSessionStore.getState();
    if (!isSameSession(current, session)) setSession(session);
  },
  component: RootComponent,
});
