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

  useEffect(() => {
    const el = section1Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setDark(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      setDark(false);
    };
  }, [setDark]);

  return (
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
  );
};

export default GuidePage;
