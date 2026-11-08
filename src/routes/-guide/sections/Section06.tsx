import { Chip } from '@umc-product/react';
import { useState } from 'react';
// import { Accordion, AccordionItem } from "@umc-product/react"

const ITEMS = ['PM', 'Challenger', 'Admin'];

const Section06 = () => {
  const [selected, setSelected] = useState<string | null>(ITEMS[0]);

  return (
    <section>
      <div className="flex flex-col items-center gap-6 pt-15">
        <h3 className="text-[22px] text-[#02746C]">FAQ</h3>
        <h1 className="text-[40px] font-bold text-brand-strong-800">자주 묻는 질문</h1>
        <div className="mt-5 flex gap-[14px]">
          {ITEMS.map((item) => (
            <div key={item} className="mb-4">
              <Chip
                variant="fill"
                color="brand"
                size="lg"
                selected={selected === item}
                onClick={() => setSelected(item)}
              >
                {item}
              </Chip>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        {/* <Accordion>
        <AccordionItem
            value="about"
            title="UMC는 어떤 동아리이고, 어떤 활동을 하나요?"
            body="UMC는 기획, 디자인, 개발 분야의 대학생들이 함께 공부하고 실제 서비스를 만들어보는 전국 단위 IT 연합 동아리예요."
          />
      </Accordion> */}
      </div>
    </section>
  );
};

export default Section06;
