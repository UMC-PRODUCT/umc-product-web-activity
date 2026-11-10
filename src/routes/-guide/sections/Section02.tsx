import Arrow from '@/routes/-guide/assets/Section2/arrow.svg';
import Image15430 from '@/routes/-guide/assets/Section2/image-15430.png';
import Image15432 from '@/routes/-guide/assets/Section2/image-15432.png';
import ScreenshotMatching from '@/routes/-guide/assets/Section2/screenshot-matching.png';
import ScreenshotSpread from '@/routes/-guide/assets/Section2/screenshot-spread.png';

const CHIPS = [
  'Notion 프로젝트 기획서',
  '구글 폼으로 지원',
  '스프레드시트로 결과 확인',
  '챌린저와 운영진 간 개별 연락',
];

const Section02 = () => {
  return (
    <section className="flex min-w-[1440px] justify-center bg-[#F6FAF9] pt-[108px] pb-[80px]">
      <div className="flex w-[1312px] flex-col items-center gap-[48px]">
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-[22px] leading-[1.4] font-medium tracking-[-0.22px] text-[#02746c]">
            Painpoint
          </p>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[40px] leading-[1.6] font-bold tracking-[-0.8px] text-[#01423d]">
              매 기수 반복되던 비효율
            </p>
            <p className="text-[24px] leading-[1.4] font-normal tracking-[-0.48px] text-[#606262]">
              노션, 구글 폼, 스프레드시트로 파편화되어 비효율적이었던 기존의 매칭 방식에 집중했어요
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-5 px-16">
          <div className="flex items-center justify-center gap-3">
            {CHIPS.map((chip, i) => (
              <div key={chip} className="flex items-center gap-3">
                <div className="flex h-[42px] items-center justify-center rounded-full bg-[#01423d] px-4">
                  <span className="text-[20px] leading-[1.4] font-medium tracking-[-0.4px] whitespace-nowrap text-white">
                    {chip}
                  </span>
                </div>
                {i < CHIPS.length - 1 && (
                  <div className="flex w-[54px] items-center justify-center">
                    <img src={Arrow} alt="" className="shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full overflow-hidden rounded-3xl border border-[#b3e5e1] bg-[#f4fbfa] px-20 py-10 opacity-80">
            <div className="relative w-full" style={{ aspectRatio: '1084 / 518' }}>
              <div
                className="absolute rounded-[4px]"
                style={{
                  left: '15.22%',
                  right: '50.46%',
                  top: '3.47%',
                  aspectRatio: '296 / 186',
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[4px]">
                  <img
                    alt=""
                    src={Image15432}
                    className="absolute top-[-0.09%] left-0 h-[110.92%] w-full max-w-none"
                  />
                </div>
                <div className="absolute inset-0 rounded-[4px] bg-black/40" />
              </div>

              <div
                className="absolute rounded-[4px]"
                style={{
                  left: '44.93%',
                  right: '22.69%',
                  top: '14.3%',
                  aspectRatio: '293 / 183',
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[4px]">
                  <img
                    alt=""
                    src={ScreenshotSpread}
                    className="absolute top-[-171.58%] left-[-6.16%] h-[271.58%] w-[133.14%] max-w-none"
                  />
                </div>
                <div className="absolute inset-0 rounded-[4px] bg-black/30" />
              </div>

              <div
                className="absolute rounded-[4px] shadow-[4px_6px_12px_0px_rgba(92,92,92,0.15)]"
                style={{
                  left: '3.97%',
                  right: '67.07%',
                  top: '37.3%',
                  aspectRatio: '390 / 305',
                }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[4px]">
                  <img
                    alt=""
                    src={ScreenshotSpread}
                    className="absolute top-0 left-[-0.01%] h-[162.95%] w-[100.03%] max-w-none"
                  />
                </div>
              </div>

              <div
                className="absolute rounded-[4px] shadow-[4px_6px_12px_0px_rgba(92,92,92,0.15)]"
                style={{
                  left: '63.75%',
                  right: '7.66%',
                  top: '12.74%',
                  aspectRatio: '1030 / 1272',
                }}
              >
                <img
                  alt=""
                  src={Image15430}
                  className="absolute inset-0 size-full max-w-none rounded-[4px] object-cover"
                />
              </div>

              <div
                className="absolute rounded-[4px] shadow-[4px_6px_12px_0px_rgba(92,92,92,0.15)]"
                style={{
                  left: '26.57%',
                  right: '30.26%',
                  top: '48.65%',
                  aspectRatio: '2886 / 1422',
                }}
              >
                <img
                  alt=""
                  src={ScreenshotMatching}
                  className="absolute inset-0 size-full max-w-none rounded-[4px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section02;
