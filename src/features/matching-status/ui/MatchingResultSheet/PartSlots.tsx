import type { MatchedMember, PartMatching, RoundMatchingKey } from '../../model/types';
import blockedSlot from './assets/blocked-slot.svg';
import MatchingRoundTag from './MatchingRoundTag';

// 피그마 결과표 한 줄에 들어가는 최대 칸 수. 모집 인원이 이보다 적으면 끝에 빗금 칸 하나
const MAX_SLOTS = 5;

const ROUND_LABEL: Record<RoundMatchingKey, string> = {
  1: '1차',
  2: '2차',
  3: '3차',
  RANDOM: '랜덤',
};

// 칸끼리 테두리가 겹치도록 -1px
const SLOT_CLASS = '-mr-px flex h-[34px] w-[124px] shrink-0 items-center gap-1.5 border px-2';

// 1차 매칭은 연한 teal 칸, 그 외 차수는 흰 칸
const memberSlotClass = (round: RoundMatchingKey, clickable: boolean) =>
  round === 1
    ? `border-teal-100 bg-teal-50 ${clickable ? 'hover:bg-teal-100' : ''}`
    : `border-teal-grey-75 bg-white ${clickable ? 'hover:bg-teal-grey-75' : ''}`;

type PartSlotsProps = {
  part: PartMatching;
  roundedClassName: string; // 첫 줄은 위 양쪽, 나머지 줄은 오른쪽 위만 둥글게 (피그마)
  // 빗금 칸을 MAX_SLOTS까지 채울지. 첫 줄은 오른쪽에 매칭 인원이 있어 빗금 칸 하나만 (피그마)
  fillBlocked: boolean;
  onMemberClick?: (member: MatchedMember) => void; // 지원서 열기 (→ 매칭 해제). 없으면 조회만
  onAddMemberClick?: () => void;
  overQuotaAddable?: boolean;
};

// 파트 하나의 매칭 결과 칸: 매칭된 챌린저 → 남은 빈 자리 → (모집 인원 밖) 빗금 칸
const PartSlots = ({
  part,
  roundedClassName,
  fillBlocked,
  onMemberClick,
  onAddMemberClick,
  overQuotaAddable = false,
}: PartSlotsProps) => {
  const onOverQuotaClick = overQuotaAddable ? onAddMemberClick : undefined;
  const emptyCount = Math.max(0, part.capacity - part.members.length);
  const slotCount = part.members.length + emptyCount;
  const blockedCount = Math.max(
    onOverQuotaClick ? 1 : 0,
    fillBlocked ? MAX_SLOTS - slotCount : Math.min(1, MAX_SLOTS - slotCount),
  );

  return (
    // 칸이 MAX_SLOTS(5)를 넘으면 5칸 너비(124 + 123 × 4)에서 다음 줄로 넘김
    // 줄끼리도 테두리가 겹치도록 칸마다 위로 -1px, 첫 줄이 잘리지 않게 목록 위 여백 1px
    <ul
      aria-label={`${part.partLabel} ${part.members.length}/${part.capacity}명 매칭`}
      className={`flex max-w-[616px] min-w-0 flex-wrap items-center overflow-clip pt-px ${roundedClassName}`}
    >
      {part.members.map((member) => {
        const content = (
          <>
            <MatchingRoundTag round={member.round} />
            <span className="sr-only">{ROUND_LABEL[member.round]} 매칭</span>
            <span className="truncate text-label-6-medium leading-[1.5] text-teal-grey-800">
              {member.challengerName}
            </span>
          </>
        );

        return (
          <li key={member.memberId} className="-mt-px flex shrink-0">
            {onMemberClick ? (
              <button
                type="button"
                onClick={() => onMemberClick(member)}
                className={`${SLOT_CLASS} text-left ${memberSlotClass(member.round, true)}`}
              >
                {content}
              </button>
            ) : (
              <span className={`${SLOT_CLASS} ${memberSlotClass(member.round, false)}`}>
                {content}
              </span>
            )}
          </li>
        );
      })}
      {Array.from({ length: emptyCount }, (_, index) => (
        <li key={`empty-${index}`} className="-mt-px flex shrink-0">
          {onAddMemberClick ? (
            <button
              type="button"
              aria-label={`${part.partLabel} 수동 배정하기`}
              onClick={onAddMemberClick}
              className={`group ${SLOT_CLASS} justify-center border-teal-grey-100 bg-white`}
            >
              <span className="text-caption-3-regular text-teal-grey-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                수동 배정하기
              </span>
            </button>
          ) : (
            <span className={`${SLOT_CLASS} border-teal-grey-100 bg-white`}>
              <span className="sr-only">빈 자리</span>
            </span>
          )}
        </li>
      ))}
      {Array.from({ length: blockedCount }, (_, index) =>
        index === 0 && onOverQuotaClick ? (
          <li key={`blocked-${index}`} className="-mt-px -mr-px shrink-0 last:mr-0">
            <button
              type="button"
              aria-label={`${part.partLabel} 모집 인원 외 수동 배정하기`}
              onClick={onOverQuotaClick}
              className="group relative block h-[34px] w-[124px]"
            >
              <img src={blockedSlot} alt="" width={124} height={34} className="block" />
              <span className="absolute inset-0 flex items-center justify-center bg-teal-grey-75 text-caption-3-regular text-teal-grey-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                수동 배정하기
              </span>
            </button>
          </li>
        ) : (
          <li key={`blocked-${index}`} aria-hidden className="-mt-px -mr-px shrink-0 last:mr-0">
            <img src={blockedSlot} alt="" width={124} height={34} className="block" />
          </li>
        ),
      )}
    </ul>
  );
};

export default PartSlots;
