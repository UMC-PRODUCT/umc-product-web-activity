import { CloseIcon } from '@umc-product/icons';
import { Dimmed, NumberBadge, Tag } from '@umc-product/react';

import type { PopupItem } from '@/routes/-guide/components/GuideCard';

const DEFAULT_BG =
  'linear-gradient(-44deg, rgba(54,211,192,0.15) 2.8%, rgba(0,0,0,0.3) 97.7%), linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%)';

type Props = {
  items: PopupItem[];
  chipText?: string;
  bg?: string;
  withDim?: boolean;
  onClose: () => void;
};

const PopupContent = ({
  items,
  chipText = '권한별 이용 안내',
  bg = DEFAULT_BG,
  onClose,
}: Omit<Props, 'withDim'>) => (
  <div
    className="w-[503px] rounded-[20px] p-[28px] backdrop-blur-[10px]"
    style={{ background: bg }}
  >
    <div className="flex flex-col gap-[39px]">
      <div className="flex items-center justify-between">
        <Tag variant="fill" color="brand" size="lg">
          {chipText}
        </Tag>
        <button onClick={onClose} className="shrink-0 text-white" aria-label="닫기">
          <CloseIcon size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-[36px]">
        {items.map((item) => (
          <div key={item.number} className="flex gap-3">
            <div className="shrink-0">
              <NumberBadge variant="fill" color="brand" size="md">
                {item.number}
              </NumberBadge>
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[18px] leading-[1.2] font-semibold text-white">{item.title}</p>
              {item.desc && (
                <p className="text-[15px] leading-[1.4] font-medium text-[#e2e3e3]">{item.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const GuideAdminInfoPopup = ({ items, chipText, bg, withDim = false, onClose }: Props) => {
  if (withDim) {
    return (
      <>
        <Dimmed intensity="medium" onClick={onClose} className="cursor-pointer" />
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 'var(--umc-z-dialog)' }}
        >
          <PopupContent items={items} chipText={chipText} bg={bg} onClose={onClose} />
        </div>
      </>
    );
  }

  return (
    <div className="absolute top-10 right-10 z-10">
      <PopupContent items={items} chipText={chipText} bg={bg} onClose={onClose} />
    </div>
  );
};

export default GuideAdminInfoPopup;
