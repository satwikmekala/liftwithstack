"use client";

import { Accordion } from "@/components/ui/Accordion";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  PRINCIPLE_ITEMS,
  PRINCIPLES_DISCLAIMER,
} from "@/lib/training-data";

export function Principles() {
  return (
    <section
      id="principles"
      className="scroll-mt-[70px] border-t border-white/[0.07] px-[clamp(20px,5vw,32px)] py-[clamp(70px,10vw,120px)]"
    >
      <div className="mx-auto max-w-[820px] text-center">
        <RevealOnScroll>
          <div className="mb-[22px] font-mono text-[11px] font-medium tracking-[0.18em] text-text-dim">
            BUILT ON ESTABLISHED STRENGTH PRINCIPLES
          </div>
          <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(30px,5vw,54px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-text">
            Progress you can measure. A plan you can repeat.
          </h2>
          <p className="mx-auto mt-[22px] max-w-[52ch] font-body text-[clamp(16px,1.9vw,19px)] leading-[1.6] text-text-muted">
            Stack turns established strength-training principles into one calm
            next action: regular training, repeatable lifts, measurable
            progression, and a structure that fits your life.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.06} className="mx-auto mt-9 max-w-[640px] text-left">
          <Accordion
            id="training-principles"
            title="Read the training principles"
            className="rounded-[20px]"
            titleClassName="font-body text-[15px] font-bold text-accent"
            contentClassName="flex flex-col gap-4 px-[22px] pb-6"
          >
            {PRINCIPLE_ITEMS.map((principle) => (
              <div key={principle.number} className="flex gap-3.5">
                <span className="w-5 shrink-0 font-mono text-xs font-bold text-accent">
                  {principle.number}
                </span>
                <div>
                  <h3 className="mb-[3px] font-body text-sm font-bold text-text">
                    {principle.title}
                  </h3>
                  <p className="font-body text-sm leading-[1.5] text-text-muted">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}

            <p className="mt-1 border-t border-white/[0.07] pt-3.5 font-body text-[12.5px] leading-[1.5] text-text-dim">
              {PRINCIPLES_DISCLAIMER}
            </p>
          </Accordion>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default Principles;
