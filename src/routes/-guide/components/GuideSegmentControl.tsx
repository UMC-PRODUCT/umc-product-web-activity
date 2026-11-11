import { cn } from '@/shared/lib/cn';

type Item = { value: string; label: string };

type GuideSegmentControlProps = {
  items: Item[];
  value: string;
  onValueChange: (value: string) => void;
};

const GuideSegmentControl = ({ items, value, onValueChange }: GuideSegmentControlProps) => {
  return (
    <div
      className={cn(
        'flex rounded-[10px] border border-white/[0.08] bg-white/10 p-1',
        items.length === 3 ? 'w-[191px]' : 'w-[127px]',
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            'flex-1 rounded-[6px] px-[10px] py-[5px] text-label-5-medium whitespace-nowrap hover:text-brand-default-600',
            value === item.value ? 'bg-[#DDF4F1] text-[#02746C]' : 'text-teal-grey-400',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default GuideSegmentControl;
