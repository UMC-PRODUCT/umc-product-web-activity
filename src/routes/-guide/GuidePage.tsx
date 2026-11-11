import { useEffect, useRef } from 'react';

import { useHeaderModeStore } from '@/widgets/header/headerModeStore';

import Section01 from './sections/Section01';
import Section02 from './sections/Section02';
import Section03 from './sections/Section03';
import Section04 from './sections/Section04';
import Section05 from './sections/Section05';
import Section06 from './sections/Section06';

const GuidePage = () => {
  const setDark = useHeaderModeStore((state) => state.setDark);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDark(true);
    return () => setDark(false);
  }, [setDark]);

  useEffect(() => {
    const sections = [
      { ref: section1Ref, dark: true },
      { ref: section2Ref, dark: false },
      { ref: section3Ref, dark: true },
      { ref: section4Ref, dark: true },
      { ref: section5Ref, dark: true },
      { ref: section6Ref, dark: false },
    ];

    const handleScroll = () => {
      for (const { ref, dark } of sections) {
        const el = ref.current;
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 0 && bottom > 0) {
          setDark(dark);
          return;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setDark]);

  return (
    <main>
      <div ref={section1Ref}>
        <Section01 />
      </div>
      <div ref={section2Ref}>
        <Section02 />
      </div>
      <div ref={section3Ref}>
        <Section03 />
      </div>
      <div ref={section4Ref}>
        <Section04 />
      </div>
      <div ref={section5Ref}>
        <Section05 />
      </div>
      <div ref={section6Ref}>
        <Section06 />
      </div>
    </main>
  );
};

export default GuidePage;
