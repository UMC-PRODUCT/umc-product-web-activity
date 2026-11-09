import {
  Button,
  HeaderActionButton,
  HeaderDesktop,
  HeaderHomeLink,
  HeaderProfileMenu,
} from '@umc-product/react';
import { useEffect, useRef, useState } from 'react';

import { EXTERNAL_LINKS, openExternalLink } from '@/shared/config/externalLinks';
import { useHeaderAuth } from '@/widgets/header/useHeaderAuth';

import Section01 from './sections/Section01';
import Section02 from './sections/Section02';
import Section03 from './sections/Section03';
import Section04 from './sections/Section04';
import Section05 from './sections/Section05';
import Section06 from './sections/Section06';

const NAV_ITEMS = [
  { label: '프로젝트', href: '/projects' },
  { label: '데모데이 매칭', href: '/demo-day' },
  { label: '사용 가이드', href: '/guide' },
];

const GuideHeader = ({ isPastSection1 }: { isPastSection1: boolean }) => {
  const { pathname, profileMenu, showLogin, handleLogin, handleLogout } = useHeaderAuth();

  const mode = isPastSection1 ? 'light' : 'dark';

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <HeaderDesktop
        mode={mode}
        logo={<HeaderHomeLink context="activity" generation={11} href="/" />}
        navItems={NAV_ITEMS}
        currentPath={pathname}
        actions={
          <>
            {mode === 'light' && (
              <HeaderActionButton onClick={() => openExternalLink(EXTERNAL_LINKS.inquiry)}>
                문의사항
              </HeaderActionButton>
            )}
            {showLogin ? (
              mode === 'dark' ? (
                <button
                  type="button"
                  className="flex h-10 cursor-pointer items-center justify-center rounded-xl border-[0.5px] border-white px-4 font-medium tracking-[-0.03em] text-white"
                  onClick={handleLogin}
                >
                  로그인
                </button>
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
    </div>
  );
};

const GuidePage = () => {
  const [isPastSection1, setIsPastSection1] = useState(false);
  const section1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section1Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPastSection1(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GuideHeader isPastSection1={isPastSection1} />
      <main>
        <div ref={section1Ref}>
          <Section01 />
        </div>
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
        <Section06 />
      </main>
    </>
  );
};

export default GuidePage;
