import { ChevronLeftIcon, ChevronRightIcon } from '@umc-product/icons';

import { cn } from '@/shared/lib/cn';

type GuidePaginationProps = {
  total: number;
  current: number;
  onChange: (index: number) => void;
};

const GuidePagination = ({ total, current, onChange }: GuidePaginationProps) => {
  const prev = () => onChange(Math.max(0, current - 1));
  const next = () => onChange(Math.min(total - 1, current + 1));

  return (
    <div className="inline-flex items-center gap-[10px] rounded-[12px] border border-white/5 bg-[#FBFCFC]/5 px-4 py-[6px] backdrop-blur-[42px]">
      <button
        type="button"
        onClick={prev}
        disabled={current === 0}
        className="text-teal-grey-700 disabled:text-teal-grey-900"
      >
        <ChevronLeftIcon size={20} />
      </button>

      <div className="flex items-center gap-[6px]">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              'h-2 rounded-full bg-teal-grey-700 transition-all',
              i === current ? 'w-[18px] bg-teal-grey-400' : 'w-2',
            )}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={next}
        disabled={current === total - 1}
        className="text-teal-grey-700 disabled:text-teal-grey-900"
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
};

export default GuidePagination;
