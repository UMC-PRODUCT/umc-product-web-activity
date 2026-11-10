import { cn } from '@/shared/lib/cn';

type CardVariant = 'default' | 'result';

type ScheduleCard = {
  round: string;
  label: string;
  variant: CardVariant;
  start?: string;
  end?: string;
  singleTime?: string;
};

type DayColumn = {
  date: string;
  cards: ScheduleCard[];
};

const ROW1: DayColumn[] = [
  {
    date: '11/13',
    cards: [
      {
        round: '1차',
        label: '지원기간',
        variant: 'default',
        start: '11월 13일 00:00',
        end: '23:59',
      },
    ],
  },
  {
    date: '11/14',
    cards: [
      {
        round: '1차',
        label: '매칭 기간',
        variant: 'default',
        start: '11월 14일 00:00',
        end: '20:00',
      },
      { round: '2차', label: '매칭 결과 발표', variant: 'result', singleTime: '11월 14일 22:00' },
    ],
  },
  {
    date: '11/15',
    cards: [
      {
        round: '2차',
        label: '지원기간',
        variant: 'default',
        start: '11월 15일 00:00',
        end: '23:59',
      },
    ],
  },
  {
    date: '11/16',
    cards: [
      {
        round: '2차',
        label: '매칭 기간',
        variant: 'default',
        start: '11월 16일 00:00',
        end: '20:00',
      },
      { round: '2차', label: '매칭 결과 발표', variant: 'result', singleTime: '11월 16일 22:00' },
    ],
  },
];

const ROW2: DayColumn[] = [
  {
    date: '11/17',
    cards: [
      {
        round: '3차',
        label: '지원기간',
        variant: 'default',
        start: '11월 17일 00:00',
        end: '23:59',
      },
    ],
  },
  {
    date: '11/18',
    cards: [
      {
        round: '3차',
        label: '매칭 기간',
        variant: 'default',
        start: '11월 18일 00:00',
        end: '20:00',
      },
      { round: '3차', label: '매칭 결과 발표', variant: 'result', singleTime: '11월 18일 22:00' },
    ],
  },
  {
    date: '11/19',
    cards: [
      {
        round: '랜덤',
        label: '매칭 기간',
        variant: 'default',
        start: '11월 19일 00:00',
        end: '20:00',
      },
      { round: '최종', label: '매칭 결과 발표', variant: 'result', singleTime: '11월 19일 22:00' },
    ],
  },
  { date: '', cards: [] },
];

const ROW1_BG =
  'linear-gradient(-45.56deg, rgba(34,144,132,0.06) 10.77%, rgba(255,255,255,0.2) 29.55%), linear-gradient(139.63deg, rgba(34,144,132,0.1) 5.09%, rgba(255,255,255,0.2) 42.81%), linear-gradient(90deg, rgba(143,255,243,0.08) 0%, rgba(143,255,243,0.08) 100%), white';

const ROW2_BG =
  'linear-gradient(-58.98deg, rgba(34,144,132,0.06) 10.74%, rgba(255,255,255,0.2) 20.29%), linear-gradient(141.42deg, rgba(255,255,255,0.2) 27.57%, rgba(34,144,132,0.1) 108.16%), linear-gradient(90deg, rgba(143,255,243,0.08) 0%, rgba(143,255,243,0.08) 100%), white';

const CalendarCard = ({ card }: { card: ScheduleCard }) => (
  <div
    className={cn(
      'flex flex-col rounded-[9px] border-l-[9.5px] border-l-[#39a9a1]',
      card.variant === 'result' ? 'bg-[#e9f7f5]' : 'bg-[#fbfcfc]',
    )}
  >
    <div
      className={cn(
        'flex flex-col gap-[4.5px] rounded-r-[9px] px-4 py-[10.6px]',
        card.variant === 'result'
          ? 'border border-l-0 border-[#ddf4f1]'
          : 'border border-l-0 border-[#eff0f0]',
      )}
    >
      <div className="flex gap-[7px] text-[22px] leading-[1.4] font-semibold tracking-[-0.66px]">
        <span className="shrink-0 text-[#02746c]">{card.round}</span>
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[#0f1010]">
          {card.label}
        </span>
      </div>
      {card.singleTime ? (
        <p className="text-[15px] leading-[1.45] whitespace-nowrap text-[#606262] opacity-80">
          {card.singleTime}
        </p>
      ) : (
        <div className="flex gap-[3px] text-[15px] leading-[1.45] whitespace-nowrap text-[#606262] opacity-80">
          <span>{card.start}</span>
          <span>~</span>
          <span>{card.end}</span>
        </div>
      )}
    </div>
  </div>
);

const DayCell = ({ day, roundedCorner }: { day: DayColumn; roundedCorner?: string }) => (
  <div
    className={cn(
      'flex h-[297px] flex-1 flex-col gap-[44px] px-[7px] pt-[23px] pb-[32px]',
      roundedCorner,
    )}
  >
    {day.date && (
      <p className="px-[14px] text-[25px] leading-none font-medium text-[#3f4141]">{day.date}</p>
    )}
    {day.cards.length > 0 && (
      <div className="flex flex-col gap-[15px]">
        {day.cards.map((card) => (
          <CalendarCard key={`${card.round}-${card.label}`} card={card} />
        ))}
      </div>
    )}
  </div>
);

const Section04 = () => {
  return (
    <section className="relative flex min-w-[1440px] justify-center overflow-hidden bg-[#020A09] pt-[260px] pb-[200px]">
      <div className="flex w-[1312px] flex-col items-center gap-[48px]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center gap-1 text-center">
          <p className="text-[32px] leading-[1.6] font-bold tracking-[-0.64px] text-white">
            팀 매칭은 <span className="text-[#36d3c0]">총 3차에 걸쳐</span> 진행돼요
          </p>
          <p className="text-[32px] leading-[1.6] font-normal tracking-[-0.64px] text-white">
            각 차수의 지원기간은 24시간이며, 지원 마감 다음 날 PM 매칭이 진행돼요.
          </p>
        </div>

        {/* 서브타이틀 */}
        <p className="text-center text-[28px] leading-[1.4] font-light text-white">
          지원기간과 매칭기간이 하루씩 번갈아 진행돼요.
          <br />각 차수의 일정을 확인하고 지원기간을 놓치지 않도록 주의해 주세요!
        </p>

        {/* 캘린더 */}
        <div className="w-[940px] overflow-hidden rounded-[18px] border border-[#ccc] bg-white p-[9px]">
          {/* Row 1 */}
          <div className="flex divide-x divide-[#e2e3e3]" style={{ background: ROW1_BG }}>
            {ROW1.map((day, i) => (
              <DayCell
                key={day.date}
                day={day}
                roundedCorner={
                  i === 0 ? 'rounded-tl-[11px]' : i === ROW1.length - 1 ? 'rounded-tr-[11px]' : ''
                }
              />
            ))}
          </div>
          {/* Row 2 */}
          <div
            className="flex divide-x divide-[#e2e3e3] border-t border-[#e2e3e3]"
            style={{ background: ROW2_BG }}
          >
            {ROW2.map((day, i) => (
              <DayCell
                key={day.date || 'empty'}
                day={day}
                roundedCorner={
                  i === 0 ? 'rounded-bl-[11px]' : i === ROW2.length - 1 ? 'rounded-br-[11px]' : ''
                }
              />
            ))}
          </div>
        </div>
        <p className="text-center text-[16px] leading-[1.4] font-medium tracking-[-0.48px] text-[#7e7f7f]">
          * 날짜와 시간은 예시이며, 변동될 수 있습니다.
        </p>
        <h1 className="text-center text-[28px] font-light text-white">
          지원기간과 매칭기간이 하루씩 번갈아 진행돼요.
          <br />각 차수의 일정을 확인하고 지원기간을 놓치지 않도록 주의해 주세요!
        </h1>
      </div>
    </section>
  );
};

export default Section04;
