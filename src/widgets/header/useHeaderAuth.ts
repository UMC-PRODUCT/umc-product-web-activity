import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';

import { myInfoQueryOptions, toSession, useSessionStore } from '@/entities/session';
import { clearAuthTokens, getAccessToken } from '@/shared/api/authToken';

import { getGisus, toGisuYears } from './gisuYears';
import { getProfileGisuIds, toProfileMenu } from './toProfileMenu';

const LOGIN_PATH = '/login';

export const useHeaderAuth = () => {
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
    void navigate({ to: LOGIN_PATH });
  };

  const handleLogout = () => {
    clearAuthTokens();
    queryClient.clear();
    void navigate({ to: LOGIN_PATH });
  };

  return { pathname, profileMenu, showLogin, handleLogin, handleLogout, serverChapterId };
};
