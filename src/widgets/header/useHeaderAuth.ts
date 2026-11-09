import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { myInfoQueryOptions, toSession, useSessionStore } from '@/entities/session';
import { getAccessToken } from '@/shared/api/authToken';
import { getSsoClient } from '@/shared/auth/sso-client';

import { getGisus, toGisuYears } from './gisuYears';
import { getProfileGisuIds, toProfileMenu } from './toProfileMenu';

const LOGIN_PATH = '/login';

export const useHeaderAuth = (options?: { logoutReturnTo?: string; loginRedirectTo?: string }) => {
  const pathname = useLocation({ select: (l) => l.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useSessionStore((state) => state.session.role);

  const hasToken = !!getAccessToken();
  const { data: myInfo, isPending } = useQuery({
    ...myInfoQueryOptions,
    enabled: pathname !== LOGIN_PATH && hasToken,
  });
  const gisuIds = myInfo ? getProfileGisuIds(myInfo) : [];
  const { data: gisuYears } = useQuery({
    queryKey: ['header', 'gisu-years', gisuIds],
    queryFn: () => getGisus(gisuIds),
    enabled: pathname !== LOGIN_PATH && hasToken && gisuIds.length > 0,
    select: toGisuYears,
  });
  const serverChapterId = myInfo ? toSession(myInfo).serverChapterId : null;
  const profileMenu = myInfo && toProfileMenu(myInfo, role, gisuYears);
  const showLogin = pathname === LOGIN_PATH || !hasToken || (!profileMenu && !isPending);

  const handleLogin = () => {
    if (pathname === LOGIN_PATH) return;
    void navigate({
      to: LOGIN_PATH,
      search: options?.loginRedirectTo ? { redirect: options.loginRedirectTo } : {},
    });
  };

  const handleLogout = () => {
    const returnPath = options?.logoutReturnTo ?? LOGIN_PATH;
    // 리다이렉트 전에 캐시를 비우면 빈 화면이 한 프레임 보여서, logout 이후에 비운다
    void getSsoClient()
      .logout({
        global: true,
        returnTo: `${window.location.origin}${returnPath}`,
      })
      .finally(() => {
        queryClient.clear();
      });
  };

  return { pathname, profileMenu, showLogin, handleLogin, handleLogout, serverChapterId };
};
