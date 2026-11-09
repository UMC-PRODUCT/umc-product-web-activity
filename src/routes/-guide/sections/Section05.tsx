import { PaginationBar } from '@umc-product/react';
import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import Admin01 from '@/routes/-guide/assets/Section5/Admin/Admin_01.png';
import Admin02 from '@/routes/-guide/assets/Section5/Admin/Admin_02.png';
import Admin03 from '@/routes/-guide/assets/Section5/Admin/Admin_03.png';
import Admin04 from '@/routes/-guide/assets/Section5/Admin/Admin_04.png';
import Admin05 from '@/routes/-guide/assets/Section5/Admin/Admin_05.png';
import Admin06 from '@/routes/-guide/assets/Section5/Admin/Admin_06.png';
import Admin07 from '@/routes/-guide/assets/Section5/Admin/Admin_07.png';
import Admin08 from '@/routes/-guide/assets/Section5/Admin/Admin_08.png';
import Admin09 from '@/routes/-guide/assets/Section5/Admin/Admin_09.png';
import Admin10 from '@/routes/-guide/assets/Section5/Admin/Admin_10.png';
import Admin11 from '@/routes/-guide/assets/Section5/Admin/Admin_11.png';
import Challenger01 from '@/routes/-guide/assets/Section5/Challenger/Challenger_01.png';
import Challenger02 from '@/routes/-guide/assets/Section5/Challenger/Challenger_02.png';
import Challenger03 from '@/routes/-guide/assets/Section5/Challenger/Challenger_03.png';
import Challenger04 from '@/routes/-guide/assets/Section5/Challenger/Challenger_04.png';
import Challenger05 from '@/routes/-guide/assets/Section5/Challenger/Challenger_05.png';
import Challenger06 from '@/routes/-guide/assets/Section5/Challenger/Challenger_06.png';
import Challenger07 from '@/routes/-guide/assets/Section5/Challenger/Challenger_07.png';
import Challenger08 from '@/routes/-guide/assets/Section5/Challenger/Challenger_08.png';
import PM01 from '@/routes/-guide/assets/Section5/PM/PM_01.png';
import PM02 from '@/routes/-guide/assets/Section5/PM/PM_02.png';
import PM03 from '@/routes/-guide/assets/Section5/PM/PM_03.png';
import PM04 from '@/routes/-guide/assets/Section5/PM/PM_04.png';
import PM05 from '@/routes/-guide/assets/Section5/PM/PM_05.png';
import PM06 from '@/routes/-guide/assets/Section5/PM/PM_06.png';
import PM07 from '@/routes/-guide/assets/Section5/PM/PM_07.png';
import PM08 from '@/routes/-guide/assets/Section5/PM/PM_08.png';
import PM09 from '@/routes/-guide/assets/Section5/PM/PM_09.png';
import GuideSegmentControl from '@/routes/-guide/components/GuideSegmentControl';
import { cn } from '@/shared/lib/cn';

const ALL_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const CHALLENGER_ITEMS = [
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const CONTENT: Record<string, string[]> = {
  admin: [
    Admin01,
    Admin02,
    Admin03,
    Admin04,
    Admin05,
    Admin06,
    Admin07,
    Admin08,
    Admin09,
    Admin10,
    Admin11,
  ],
  pm: [PM01, PM02, PM03, PM04, PM05, PM06, PM07, PM08, PM09],
  challenger: [
    Challenger01,
    Challenger02,
    Challenger03,
    Challenger04,
    Challenger05,
    Challenger06,
    Challenger07,
    Challenger08,
  ],
};

const Section05 = () => {
  const role = useSessionStore((state) => state.session.role);
  const isAdmin = role !== 'CHALLENGER_PM' && role !== 'CHALLENGER';
  const items = isAdmin ? ALL_ITEMS : CHALLENGER_ITEMS;

  const [selected, setSelected] = useState(items[0].value);
  const [currentPage, setCurrentPage] = useState(0);

  const images = CONTENT[selected];

  const handleTabChange = (value: string) => {
    setSelected(value);
    setCurrentPage(0);
  };

  return (
    <section className="flex min-w-[1440px] flex-col items-center bg-teal-grey-900 py-[60px]">
      <div className="flex w-[1320px] flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-medium font-semibold text-[#9BE9E0]">
            Guide <span className="text-[#36D3C0]"> | 사용 메뉴얼</span>
          </p>
          <GuideSegmentControl items={items} value={selected} onValueChange={handleTabChange} />
        </div>
        <div
          className={cn(
            'relative mt-3 mb-5 h-[740px] w-full overflow-hidden rounded-2xl px-10 pt-10',
            currentPage === images.length - 1 ? 'pb-0' : 'pb-[66px]',
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#2ED1BE]/40 to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2ED1BE] to-transparent opacity-40" />
          {images[currentPage] && (
            <img src={images[currentPage]} alt="" className="relative z-10" />
          )}
        </div>
        <PaginationBar
          totalPages={images.length}
          page={currentPage + 1}
          onPageChange={(page: number) => setCurrentPage(page - 1)}
          highlightNext
        />
      </div>
    </section>
  );
};

export default Section05;
