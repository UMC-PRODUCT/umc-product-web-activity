import { cn } from '@/shared/lib/cn';

import bestNeutral from './assets/face-best-neutral-22.svg';
import bestPrimary from './assets/face-best-primary-22.svg';
import worstNeutral from './assets/face-worst-neutral-22.svg';
import worstPrimary from './assets/face-worst-primary-22.svg';

const FACES = [
  { neutral: worstNeutral, primary: worstPrimary },
  { neutral: bestNeutral, primary: bestPrimary },
] as const;

type EmojiChoiceOption = { optionId: number; label: string };

type EmojiChoiceProps = {
  options: EmojiChoiceOption[];
  value: number | null;
  onChange: (optionId: number) => void;
  'aria-label'?: string;
};

const EmojiChoice = ({ options, value, onChange, 'aria-label': ariaLabel }: EmojiChoiceProps) => (
  <div role="radiogroup" aria-label={ariaLabel} className="flex items-center gap-4">
    {options.map(({ optionId, label }, index) => {
      const selected = value === optionId;
      const face = FACES[index];
      return (
        <button
          key={optionId}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(optionId)}
          className={cn(
            'flex cursor-pointer items-center rounded-lg border-[1.5px] py-2.5 pr-3 pl-2.5 text-title-4-semibold whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-teal-300',
            selected
              ? 'gap-4 border-teal-300 bg-teal-75 text-teal-600'
              : 'gap-3 border-transparent bg-teal-grey-100 text-teal-grey-600',
          )}
        >
          <img
            src={selected ? face.primary : face.neutral}
            alt=""
            width={22}
            height={22}
            className="shrink-0"
          />
          {label}
        </button>
      );
    })}
  </div>
);

export default EmojiChoice;
