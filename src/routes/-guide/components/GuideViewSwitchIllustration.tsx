import { CheckIcon, ExpandMoreIcon } from '@umc-product/icons';

import ViewSwitchCursor from '@/routes/-guide/assets/Section5/Admin/ViewSwitch_cursor.png';

// 어드민 가이드 '권한별 뷰 전환' 카드의 설명 그림: 사이드바 뷰 드롭다운에서 Challenger View를 고르는 모습
// 실제 ContextSwitcher는 닫힌 채로 시작해서, 펼친 모양을 그림으로 그림
const GuideViewSwitchIllustration = () => (
  <div className="relative ml-8 w-[150px] drop-shadow-[0px_3.5px_7px_rgba(64,68,67,0.16)]">
    <div className="flex items-center justify-between rounded-[7px] bg-teal-grey-100 py-[3.5px] pr-[7px] pl-[10.5px]">
      <p className="text-[12.2px] leading-[1.5] text-teal-grey-600">Admin View</p>
      <ExpandMoreIcon size={14} className="text-teal-grey-600" />
    </div>
    <div className="rounded-[7px] bg-white p-[1.75px]">
      <p className="px-[10.5px] py-[3.5px] text-[12.2px] leading-[1.5] text-teal-grey-900">
        Admin View
      </p>
      <div className="flex items-center justify-between rounded-[7px] bg-teal-50 py-[3.5px] pr-[7px] pl-[10.5px] shadow-[inset_0.87px_0.87px_1.74px_0px_rgba(211,216,216,0.2)]">
        <p className="text-[12.2px] leading-[1.5] font-medium text-teal-600">Challenger View</p>
        <CheckIcon size={14} className="text-teal-600" />
      </div>
    </div>
    <img
      src={ViewSwitchCursor}
      alt=""
      className="absolute top-16 left-[134px] size-[42px] max-w-none object-cover"
    />
  </div>
);

export default GuideViewSwitchIllustration;
