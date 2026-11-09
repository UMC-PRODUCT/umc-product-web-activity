import {
  Button,
  HeaderActionButton,
  HeaderDesktop,
  HeaderHomeLink,
  HeaderProfileMenu,
} from '@umc-product/react';

import { EXTERNAL_LINKS, openExternalLink } from '@/shared/config/externalLinks';

import { useHeaderAuth } from './useHeaderAuth';

const NAV_ITEMS = [
  { label: '프로젝트', href: '/projects' },
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '사용 가이드', href: '/guide' },
];

const Header = () => {
  const { pathname, profileMenu, showLogin, handleLogin, handleLogout } = useHeaderAuth();

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
