import { Fragment } from 'react';

import HeroBg from '@/routes/-guide/assets/Section1/Hero BG Section.jpg';
import Line from '@/routes/-guide/assets/Section1/line.svg';
import MockupImage from '@/routes/-guide/assets/Section1/MockUp.png';

const STEPS = ['프로젝트 탐색', '팀 매칭', '지원 · 매칭 현황', '결과 확인'];

const Section01 = () => {
  return (
    <section className="relative min-h-screen min-w-[1440px] overflow-hidden rounded-br-[60px] rounded-bl-[60px] bg-[#020A09] pt-header">
      <div className="absolute inset-0 bg-[linear-gradient(133.22deg,rgba(46,209,190,0.16)_8.35%,rgba(46,209,190,0)_48.63%),linear-gradient(90deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%)]" />
      <div className="absolute inset-0 overflow-hidden opacity-[0.08]">
        <img
          src={HeroBg}
          alt=""
          className="absolute top-0 left-[-2.15%] h-full w-[104.3%] object-cover"
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center gap-[21px] 3xl:px-30">
        <div className="flex flex-col items-baseline justify-center gap-[145.83px]">
          <div>
            <div className="flex flex-col gap-[3px] text-white">
              <h1 className="font-['KIMM'] text-[64px]">UMC Demo Day</h1>
              <h1 className="text-[61px] font-bold">팀 매칭 시스템</h1>
            </div>
            <h3 className="pt-[14px] text-[29px] text-[#36D3C0]">Team Matching System</h3>
          </div>
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-5">
              {STEPS.map((step, i) => (
                <Fragment key={step}>
                  <h3 className="text-[22px] font-light text-teal-grey-200">{step}</h3>
                  {i < STEPS.length - 1 && <img src={Line} alt="" />}
                </Fragment>
              ))}
            </div>
            <h3 className="text-[22px] text-teal-grey-400">
              프로젝트 등록부터 팀 매칭까지, 데모데이 매칭을 더 쉽고 편리하게 경험해보세요
            </h3>
          </div>
        </div>
        <img src={MockupImage} alt="Mockup" className="w-[671px]" />
      </div>
    </section>
  );
};

export default Section01;
