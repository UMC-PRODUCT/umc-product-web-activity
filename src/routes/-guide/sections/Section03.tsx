import MockupScreens from '@/routes/-guide/assets/Section3/mockup-screens.png';
import StepDash from '@/routes/-guide/assets/Section3/step-dash.svg';
import StepDashEnd from '@/routes/-guide/assets/Section3/step-dash-end.svg';

const STEPS = [
  '프로젝트 등록 & 탐색',
  '팀 매칭 지원서 작성',
  '지원 · 매칭 현황 확인',
  '매칭 결과 확인',
];

const Section03 = () => {
  return (
    <section className="relative flex min-w-[1440px] justify-center overflow-hidden bg-[#020A09] pt-[168px] pb-[60px]">
      {/* 테알 방사형 글로우 배경 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 659px 400px at 50% 55%, rgba(54,211,192,0.28) 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10 flex w-[1312px] flex-col items-center gap-[48px]">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-[22px] leading-[1.4] font-medium tracking-[-0.22px] text-[#008a80]">
            Solution
          </p>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[32px] leading-[1.6] font-bold tracking-[-0.64px] text-white">
              프로젝트 등록 및 조회, 지원 폼 제출, 실시간 매칭 결과 확인까지
            </p>
            <p className="text-[32px] leading-[1.6] font-normal tracking-[-0.64px] text-white">
              한 번에 해결할 수 있어요!
            </p>
          </div>
        </div>

        {/* 목업 스크린샷 (3화면) */}
        <img
          src={MockupScreens}
          alt="데모데이 매칭 시스템 화면 목업"
          className="w-full max-w-[1272px]"
        />

        {/* 스텝 레이블 */}
        <div className="flex items-center gap-[22.5px]">
          <img src={StepDash} alt="" className="w-[50.25px] shrink-0" />
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-[22.5px]">
              <span className="text-[16.5px] leading-[1.6] font-light tracking-[-0.495px] whitespace-nowrap text-[#e2e3e3]">
                {step}
              </span>
              {i < STEPS.length - 1 ? (
                <img src={StepDash} alt="" className="w-[50.25px] shrink-0" />
              ) : (
                <img src={StepDashEnd} alt="" className="w-[100.5px] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section03;
