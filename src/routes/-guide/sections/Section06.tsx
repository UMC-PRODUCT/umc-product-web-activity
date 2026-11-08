import { Accordion, AccordionItem, Chip } from '@umc-product/react';
import { useState } from 'react';

import { FAQ_DATA } from '../data/section06';

const ITEMS = ['PM', 'Challenger', 'Admin'];

const Section06 = () => {
  const [selected, setSelected] = useState<string>(ITEMS[0]);

  const faqs = FAQ_DATA[selected] ?? [];

  return (
    <section className="min-w-[1440px] bg-[#F6FAF9]">
      <div className="flex flex-col items-center gap-6 pt-[90px]">
        <h3 className="text-[22px] text-brand-default-600">FAQ</h3>
        <h1 className="text-display-2-semibold text-brand-strong-800">자주 묻는 질문</h1>
        <div className="mt-5 flex gap-3.5">
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
      <div className="mt-8 mb-30 px-34 3xl:px-90">
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={String(index)} title={faq.title} body={faq.body} />
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Section06;
