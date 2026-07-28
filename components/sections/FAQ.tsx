"use client";

import { Accordion } from "@/components/ui/Accordion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { FAQ_ITEMS } from "@/lib/training-data";

export function FAQ() {
  return (
    <section className="mx-auto max-w-[820px] px-[clamp(20px,5vw,32px)] py-[clamp(50px,7vw,80px)]">
      <RevealOnScroll className="mb-8 text-center">
        <h2 className="font-mono text-[11px] font-medium tracking-[0.2em] text-text-dim">
          QUESTIONS
        </h2>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05} className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => (
          <Accordion
            key={item.id}
            id={`faq-${item.id}`}
            title={item.question}
            titleClassName="font-body text-[clamp(16px,2vw,18px)] font-bold text-text"
            contentClassName="px-[22px] pb-[22px]"
          >
            <p className="font-body text-[15px] leading-[1.6] text-text-muted">
              {item.answer}
            </p>
          </Accordion>
        ))}
      </RevealOnScroll>
    </section>
  );
}

export default FAQ;
