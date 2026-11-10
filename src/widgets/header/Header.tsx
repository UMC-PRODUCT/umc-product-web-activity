import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { LinkProps } from '@tanstack/react-router';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  Button,
  HeaderActionButton,
  HeaderDesktop,
  HeaderHomeLink,
  HeaderProfileMenu,
} from '@umc-product/react';

import { myInfoQueryOptions, useSessionStore } from '@/entities/session';
import { getSsoClient } from '@/shared/auth/sso-client';
import { EXTERNAL_LINKS, openExternalLink } from '@/shared/config/externalLinks';

import { getGisus, toGisuYears } from './gisuYears';
import { getProfileGisuIds, toProfileMenu } from './toProfileMenu';

type HeaderNavItem = { label: string; href: NonNullable<LinkProps['to']> | `https://${string}` };

// 피그마 Web/Header: 홈은 로고(DS HeaderHomeLink, Header 기본 logo)로 이동하고 메뉴는 3개
const NAV_ITEMS: HeaderNavItem[] = [
  { label: '프로젝트', href: EXTERNAL_LINKS.projects },
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '사용 가이드', href: '/guide' },
];

const LOGIN_PATH = '/login';
const PUBLIC_AUTH_PATHS = new Set([LOGIN_PATH, '/auth/callback']);

const Header = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const role = useSessionStore((state) => state.session.role);
  const isPublicAuthPath = PUBLIC_AUTH_PATHS.has(pathname);
  // 로그인 · 콜백에서는 토큰이 없어 내 정보를 부르지 않음 (루트 beforeLoad가 이미 불러와 캐시에 있음)
  const { data: myInfo, isPending } = useQuery({
    ...myInfoQueryOptions,
    enabled: !isPublicAuthPath,
  });
  const gisuIds = myInfo ? getProfileGisuIds(myInfo) : [];
  // 기수 오른쪽 연도. 불러오지 못해도 메뉴는 그대로 쓸 수 있어서 연도만 비워 둠
  const { data: gisuYears } = useQuery({
    queryKey: ['header', 'gisu-years', gisuIds],
    queryFn: () => getGisus(gisuIds),
    enabled: !isPublicAuthPath && gisuIds.length > 0,
    select: toGisuYears,
  });
  const profileMenu = myInfo && toProfileMenu(myInfo, role, gisuYears);
  // 로그인 화면이거나 내 정보를 못 불러왔으면(로그아웃 상태) 로그인 버튼. 불러오는 중에는 둘 다 안 보임
  const showLogin = isPublicAuthPath || (!profileMenu && !isPending);

  const handleLogin = () => {
    if (pathname === LOGIN_PATH) return;
    void navigate({ to: LOGIN_PATH });
  };

  const handleLogout = () => {
    // 리다이렉트 전에 캐시를 비우면 빈 화면이 한 프레임 보여서, logout 이후에 비운다
    void getSsoClient()
      .logout({
        global: true,
        returnTo: `${window.location.origin}${LOGIN_PATH}`,
      })
      .finally(() => {
        queryClient.clear();
      });
  };

  return (
    <HeaderDesktop
      logo={<HeaderHomeLink context="activity" generation={11} href="/" />}
      navItems={NAV_ITEMS}
      currentPath={pathname.startsWith('/demo-day') ? HOME_PATH : pathname}
      actions={
        <>
          <HeaderActionButton onClick={() => openExternalLink(EXTERNAL_LINKS.inquiry)}>
            문의사항
          </HeaderActionButton>
          {showLogin ? (
            // 피그마 Web/Header 로그인: DS Button weak · brand · sm
            <Button variant="weak" color="brand" size="sm" onClick={handleLogin}>
              로그인
            </Button>
          ) : (
            profileMenu && (
              <HeaderProfileMenu
                profile={profileMenu.profile}
                generations={profileMenu.generations}
                generation={profileMenu.generation}
                // TODO: 계정 설정 화면이 생기면 연결하고 app.css의 숨김 규칙 제거
                onLogout={handleLogout}
              />
            )
          )}
        </>
      }
    />
  );
};

export default Header;
