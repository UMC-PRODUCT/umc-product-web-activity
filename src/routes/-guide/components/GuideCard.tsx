import { NumberBadge, Tag } from '@umc-product/react';
import { useState } from 'react';

import IconInfo from '@/routes/-guide/assets/icon-info.svg';
import GuideAdminInfoPopup from '@/routes/-guide/components/GuideAdminInfoPopup';

type GuideItem = {
  number?: number;
  title: string;
  desc: string;
};

export type PopupItem = {
  number: number;
  title: string;
  desc?: string;
};

export type GuideCardData = {
  chip: string;
  step: string;
  title: string;
  body: string;
  mockupSrc: string;
  items: GuideItem[];
  note?: string;
  isAdmin?: boolean;
  popupItems?: PopupItem[];
  popupChipText?: string;
  popupBg?: string;
  periodPopupItems?: PopupItem[];
  periodPopupChipText?: string;
  periodPopupBg?: string;
};

const CARD_BG =
  'linear-gradient(134.38deg, rgba(46,209,190,0.16) 8.35%, rgba(46,209,190,0) 48.63%), linear-gradient(-54.78deg, rgba(46,209,190,0.4) 16.52%, rgba(46,209,190,0) 37.28%)';

const GuideCard = ({
  chip,
  step,
  title,
  body,
  mockupSrc,
  items,
  note,
  isAdmin,
  popupItems,
  popupChipText,
  popupBg,
  periodPopupItems,
  periodPopupChipText,
  periodPopupBg,
}: GuideCardData) => {
  const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);
  const [isPeriodPopupOpen, setIsPeriodPopupOpen] = useState(false);
  const showRoleButton = isAdmin && popupItems && popupItems.length > 0;
  const showPeriodButton = isAdmin && periodPopupItems && periodPopupItems.length > 0;

  return (
    <div className="relative">
      <div
        className="h-[740px] w-full overflow-hidden rounded-[16px] p-10"
        style={{ background: CARD_BG }}
      >
        <div className="flex h-full flex-col gap-[41px]">
          <div className="flex flex-col gap-[28px]">
            <div className="flex justify-between">
              <p className="text-[18px] leading-[1.4] font-semibold text-[#36d3c0]">{step}</p>
              {showRoleButton && (
                <div className="flex items-center gap-[6px]">
                  <img src={IconInfo} alt="" className="size-[20px] shrink-0" />
                  <button className="group" onClick={() => setIsRolePopupOpen(true)}>
                    <p className="text-heading-5-medium text-white decoration-white decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font] group-hover:underline group-active:underline">
                      권한 별 이용 안내
                    </p>
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-[6px]">
              <p className="text-[24px] leading-[1.35] font-bold text-white">{title}</p>
              <p className="text-[24px] leading-[1.35] font-normal text-white">{body}</p>
            </div>
          </div>
          <div className="flex gap-[53px]">
            <div className="h-[470px] w-[700px] shrink-0 overflow-hidden rounded-[12px]">
              <img src={mockupSrc} alt="" className="h-full w-full object-cover object-top" />
            </div>
            <div className="flex flex-col gap-[39px]">
              <Tag variant="fill" color="brand" size="lg" className="self-start">
                {chip}
              </Tag>
              <div className="flex flex-col gap-[36px]">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    {item.number !== undefined && (
                      <div className="shrink-0">
                        <NumberBadge variant="fill" color="brand" size="md">
                          {item.number}
                        </NumberBadge>
                      </div>
                    )}
                    <div className="flex flex-col gap-[6px]">
                      <p className="text-[18px] leading-[1.2] font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="text-[15px] leading-[1.4] font-medium text-[#e2e3e3]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {note && (
                <div className="rounded-[10px] border border-white/10 bg-white/[0.08] p-3">
                  <p className="text-[14px] leading-[1.4] text-[#e2e3e3]">{note}</p>
                </div>
              )}
              {showPeriodButton && (
                <div className="absolute right-10 bottom-[43px] flex items-center gap-[6px]">
                  <img src={IconInfo} alt="" className="size-[20px] shrink-0" />
                  <button className="group" onClick={() => setIsPeriodPopupOpen(true)}>
                    <p className="text-heading-5-medium text-teal-grey-200">
                      수동 배정 및 매칭 해제 가능 기간
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showRoleButton && isRolePopupOpen && (
        <GuideAdminInfoPopup
          items={popupItems}
          chipText={popupChipText}
          bg={popupBg}
          withDim={false}
          onClose={() => setIsRolePopupOpen(false)}
        />
      )}
      {showPeriodButton && isPeriodPopupOpen && (
        <GuideAdminInfoPopup
          items={periodPopupItems}
          chipText={periodPopupChipText}
          bg={periodPopupBg}
          withDim={true}
          onClose={() => setIsPeriodPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default GuideCard;
