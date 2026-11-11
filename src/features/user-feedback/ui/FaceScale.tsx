import badFill from './assets/face-bad-fill-40.svg';
import badHover from './assets/face-bad-hover-32.svg';
import badWeak from './assets/face-bad-weak-32.svg';
import bestFill from './assets/face-best-fill-40.svg';
import bestHover from './assets/face-best-hover-32.svg';
import bestWeak from './assets/face-best-weak-32.svg';
import goodFill from './assets/face-good-fill-40.svg';
import goodHover from './assets/face-good-hover-32.svg';
import goodWeak from './assets/face-good-weak-32.svg';
import normalFill from './assets/face-normal-fill-40.svg';
import normalHover from './assets/face-normal-hover-32.svg';
import normalWeak from './assets/face-normal-weak-32.svg';
import worstFill from './assets/face-worst-fill-40.svg';
import worstHover from './assets/face-worst-hover-32.svg';
import worstWeak from './assets/face-worst-weak-32.svg';
import scaleLine from './assets/scale-line.svg';

const FACES = [
  { weak: worstWeak, hover: worstHover, fill: worstFill },
  { weak: badWeak, hover: badHover, fill: badFill },
  { weak: normalWeak, hover: normalHover, fill: normalFill },
  { weak: goodWeak, hover: goodHover, fill: goodFill },
  { weak: bestWeak, hover: bestHover, fill: bestFill },
] as const;

const LABELED_INDEXES = [0, 2, 4];

type FaceScaleOption = { optionId: number; label: string };

type FaceScaleProps = {
  options: FaceScaleOption[];
  value: number | null;
  onChange: (optionId: number) => void;
  'aria-label'?: string;
};

const FaceScale = ({ options, value, onChange, 'aria-label': ariaLabel }: FaceScaleProps) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className="relative flex w-full items-end justify-center gap-10"
  >
    <img
      src={scaleLine}
      alt=""
      width={320}
      height={2}
      className="absolute top-[46px] left-1/2 -translate-x-1/2"
    />
    {options.map(({ optionId, label }, index) => {
      const face = FACES[index];
      const selected = value === optionId;
      const button = (
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          aria-label={label}
          onClick={() => onChange(optionId)}
          className="group relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
        >
          {selected ? (
            <img src={face.fill} alt="" width={40} height={40} />
          ) : (
            <>
              <img src={face.weak} alt="" width={32} height={32} className="group-hover:hidden" />
              <img
                src={face.hover}
                alt=""
                width={36}
                height={36}
                className="hidden group-hover:block"
              />
            </>
          )}
        </button>
      );

      if (!LABELED_INDEXES.includes(index)) return <div key={optionId}>{button}</div>;
      return (
        <div key={optionId} className="flex w-10 flex-col items-center gap-1.5">
          <p
            aria-hidden
            className="text-center text-[14px] leading-[1.45] font-medium whitespace-nowrap text-teal-600"
          >
            {label}
          </p>
          {button}
        </div>
      );
    })}
  </div>
);

export default FaceScale;
