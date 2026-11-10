import { PaginationBar } from '@umc-product/react';
import { useState } from 'react';

import { useSessionStore } from '@/entities/session';
import type { GuideCardData } from '@/routes/-guide/components/GuideCard';
import GuideCard from '@/routes/-guide/components/GuideCard';
import GuideSegmentControl from '@/routes/-guide/components/GuideSegmentControl';
import { ADMIN_CARDS } from '@/routes/-guide/data/adminCards';
import { CHALLENGER_CARDS } from '@/routes/-guide/data/challengerCards';
import { PM_CARDS } from '@/routes/-guide/data/pmCards';

const ALL_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const CHALLENGER_ITEMS = [
  { value: 'pm', label: 'PM' },
  { value: 'challenger', label: '챌린저' },
];

const GUIDE_CARDS: Record<string, GuideCardData[]> = {
  admin: ADMIN_CARDS,
  pm: PM_CARDS,
  challenger: CHALLENGER_CARDS,
};

const Section05 = () => {
  const role = useSessionStore((state) => state.session.role);
  const isAdmin = role !== 'CHALLENGER_PM' && role !== 'CHALLENGER';
  const items = isAdmin ? ALL_ITEMS : CHALLENGER_ITEMS;

  const [selected, setSelected] = useState(items[0].value);
  const [currentPage, setCurrentPage] = useState(0);

  const handleTabChange = (value: string) => {
    setSelected(value);
    setCurrentPage(0);
  };

  const guideCards = GUIDE_CARDS[selected];
  const totalPages = guideCards.length;

  return (
    <section className="flex min-w-[1440px] flex-col items-center bg-teal-grey-900 py-[60px]">
      <div className="flex w-[1320px] flex-col items-center">
        <div className="flex w-full items-center justify-between">
          <p className="text-title-3-medium font-semibold text-[#9BE9E0]">
            Guide <span className="text-[#36D3C0]"> | 사용 메뉴얼</span>
          </p>
          <GuideSegmentControl items={items} value={selected} onValueChange={handleTabChange} />
        </div>
        <div className="mt-3 mb-5 w-full">
          <GuideCard {...guideCards[currentPage]} isAdmin={selected === 'admin'} />
        </div>
        <PaginationBar
          totalPages={totalPages}
          page={currentPage + 1}
          onPageChange={(page: number) => setCurrentPage(page - 1)}
          highlightNext
        />
      </div>
    </section>
  );
};

export default Section05;
