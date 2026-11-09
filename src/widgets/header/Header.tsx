import {
  Button,
  HeaderActionButton,
  HeaderDesktop,
  HeaderHomeLink,
  HeaderProfileMenu,
} from '@umc-product/react';

import { EXTERNAL_LINKS, openExternalLink } from '@/shared/config/externalLinks';

import { useHeaderAuth } from './useHeaderAuth';

type HeaderNavItem = { label: string; href: string };

// 피그마 Web/Header: 홈은 로고(DS HeaderHomeLink, Header 기본 logo)로 이동하고 메뉴는 3개
const NAV_ITEMS: HeaderNavItem[] = [
  { label: '프로젝트', href: EXTERNAL_LINKS.projects },
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '사용 가이드', href: '/guide' },
];

const Header = () => {
  const { pathname, profileMenu, showLogin, handleLogin, handleLogout } = useHeaderAuth({
    logoutReturnTo: '/guide',
  });

  return (
    <HeaderDesktop
      logo={<HeaderHomeLink context="activity" generation={11} href="/" />}
      navItems={NAV_ITEMS}
      currentPath={pathname}
      actions={
        <>
          <HeaderActionButton onClick={() => openExternalLink(EXTERNAL_LINKS.inquiry)}>
            문의사항
          </HeaderActionButton>
          {showLogin ? (
            <Button variant="weak" color="brand" size="sm" onClick={handleLogin}>
              로그인
            </Button>
          ) : (
            profileMenu && (
              <HeaderProfileMenu
                profile={profileMenu.profile}
                generations={profileMenu.generations}
                generation={profileMenu.generation}
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
