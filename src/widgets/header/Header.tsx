import {
  Button,
  HeaderActionButton,
  HeaderDesktop,
  HeaderHomeLink,
  HeaderProfileMenu,
} from '@umc-product/react';

import { EXTERNAL_LINKS, openExternalLink } from '@/shared/config/externalLinks';
import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

import { useHeaderModeStore } from './headerModeStore';
import { useHeaderAuth } from './useHeaderAuth';

type HeaderNavItem = { label: string; href: string };

const NAV_ITEMS: HeaderNavItem[] = [
  { label: '프로젝트', href: EXTERNAL_LINKS.projects },
  { label: '데모데이 매칭', href: HOME_PATH },
  { label: '사용 가이드', href: '/guide' },
];

const Header = () => {
  const isDark = useHeaderModeStore((state) => state.isDark);
  const { pathname, profileMenu, showLogin, handleLogin, handleLogout } = useHeaderAuth({
    logoutReturnTo: '/guide',
    loginRedirectTo: HOME_PATH,
  });

  return (
    <HeaderDesktop
      mode={isDark ? 'dark' : 'light'}
      logo={<HeaderHomeLink context="activity" generation={11} href="/" />}
      navItems={NAV_ITEMS}
      currentPath={pathname}
      actions={
        <>
          {isDark ? (
            <div>
              {/* <Button size="sm" onClick={() => openExternalLink(EXTERNAL_LINKS.umcWebsite)}>
                UMC 바로가기
              </Button> */}
            </div>
          ) : (
            <HeaderActionButton onClick={() => openExternalLink(EXTERNAL_LINKS.inquiry)}>
              문의사항
            </HeaderActionButton>
          )}
          {showLogin ? (
            isDark ? (
              <Button size="sm" variant="weak" onClick={handleLogin}>
                로그인
              </Button>
            ) : (
              <Button variant="weak" color="brand" size="sm" onClick={handleLogin}>
                로그인
              </Button>
            )
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
